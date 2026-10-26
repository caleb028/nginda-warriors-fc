import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminRoleCode, AdminSessionPayload, AdminUser, hasModulePermission } from './types';
import { createUuid, readDatabase, recordAuditLog, writeDatabase } from './db';

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  'nginda-warriors-fc-control-centre-server-jwt-secret-key-2024';

export const ADMIN_SESSION_COOKIE_NAME = 'nginda_control_session';

export type { AdminSessionPayload };

// In-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (record.count >= 8) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }
  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearLoginRateLimit(key: string): void {
  loginAttempts.delete(key);
}

export function isSystemBootstrapped(): boolean {
  const db = readDatabase();
  return db.users.some((u) => u.isOwnerSuperAdmin && u.roleCode === 'SUPER_ADMIN');
}

export function bootstrapOwnerSuperAdmin(params: {
  fullName: string;
  email: string;
  password: string;
  setupToken?: string;
}): { user: Omit<AdminUser, 'passwordHash'>; token: string } {
  const db = readDatabase();
  if (db.users.some((u) => u.isOwnerSuperAdmin)) {
    throw new Error('System ownership has already been bootstrapped. Please sign in at /login.');
  }

  const configuredSetupToken = process.env.SUPER_ADMIN_SETUP_TOKEN;
  if (
    configuredSetupToken &&
    configuredSetupToken !== 'replace-with-one-time-owner-setup-token' &&
    params.setupToken !== configuredSetupToken
  ) {
    throw new Error('Invalid Super Admin setup authorization token.');
  }

  if (!params.fullName || params.fullName.trim().length < 2) {
    throw new Error('Full name is required to establish Super Admin ownership.');
  }
  if (!params.email || !params.email.includes('@')) {
    throw new Error('A valid administrator email address is required.');
  }
  if (!params.password || params.password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(params.password, 10);

  const ownerUser: AdminUser = {
    id: createUuid(),
    email: params.email.trim().toLowerCase(),
    fullName: params.fullName.trim(),
    passwordHash,
    roleCode: 'SUPER_ADMIN',
    isOwnerSuperAdmin: true,
    isActive: true,
    mfaEnabled: false,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(ownerUser);

  recordAuditLog(db, {
    actorUserId: ownerUser.id,
    actorName: ownerUser.fullName,
    actorRole: 'SUPER_ADMIN',
    action: 'BOOTSTRAP_OWNER_SUPER_ADMIN',
    module: 'security',
    targetId: ownerUser.id,
    summary: `Established primary Super Administrator ownership for ${ownerUser.email}`,
  });

  writeDatabase(db);

  const token = signAdminSession(ownerUser);
  const { passwordHash: _removed, ...safeUser } = ownerUser;
  return { user: safeUser, token };
}

export function authenticateAdminUser(params: {
  email: string;
  password: string;
  clientIp?: string;
}): { user: Omit<AdminUser, 'passwordHash'>; token: string } {
  const rateKey = `${params.clientIp || 'local'}:${(params.email || '').toLowerCase()}`;
  const rate = checkLoginRateLimit(rateKey);
  if (!rate.allowed) {
    throw new Error(`Too many login attempts. Please wait ${rate.retryAfterSeconds} seconds.`);
  }

  const db = readDatabase();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === (params.email || '').trim().toLowerCase()
  );

  if (!user || !user.isActive) {
    throw new Error('Invalid administrator email or password.');
  }

  const valid = bcrypt.compareSync(params.password || '', user.passwordHash);
  if (!valid) {
    recordAuditLog(db, {
      actorUserId: user.id,
      actorName: user.fullName,
      actorRole: user.roleCode,
      action: 'LOGIN_FAILED',
      module: 'security',
      targetId: user.id,
      summary: `Failed login attempt for ${user.email}`,
    });
    writeDatabase(db);
    throw new Error('Invalid administrator email or password.');
  }

  clearLoginRateLimit(rateKey);
  user.lastLoginAt = new Date().toISOString();
  recordAuditLog(db, {
    actorUserId: user.id,
    actorName: user.fullName,
    actorRole: user.roleCode,
    action: 'LOGIN_SUCCESS',
    module: 'security',
    targetId: user.id,
    summary: `Authenticated session started for ${user.email} (${user.roleCode})`,
  });
  writeDatabase(db);

  const token = signAdminSession(user);
  const { passwordHash: _removed, ...safeUser } = user;
  return { user: safeUser, token };
}

export function signAdminSession(user: AdminUser): string {
  const payload: AdminSessionPayload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    roleCode: user.roleCode,
    isOwnerSuperAdmin: user.isOwnerSuperAdmin,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

export function verifyAdminSessionToken(token?: string | null): AdminSessionPayload | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSessionPayload;
    const db = readDatabase();
    const user = db.users.find((u) => u.id === decoded.userId && u.isActive);
    if (!user) return null;
    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      roleCode: user.roleCode,
      isOwnerSuperAdmin: user.isOwnerSuperAdmin,
    };
  } catch {
    return null;
  }
}

export function assertAuthorizedAdmin(
  token: string | null | undefined,
  requiredModule: string
): AdminSessionPayload {
  const session = verifyAdminSessionToken(token);
  if (!session) {
    throw new Error('UNAUTHORIZED: Valid Control Centre session required.');
  }
  if (!hasModulePermission(session.roleCode, requiredModule)) {
    throw new Error(
      `FORBIDDEN: Role ${session.roleCode} does not have permission for module "${requiredModule}".`
    );
  }
  return session;
}
