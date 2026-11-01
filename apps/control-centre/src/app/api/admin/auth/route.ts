import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE_NAME,
  assertValidCsrfOrigin,
  authenticateAdminUser,
  bootstrapOwnerSuperAdmin,
  extractAdminToken,
  getSafeClientIp,
  isSystemBootstrapped,
  revokeUserSessions,
  verifyAdminSessionToken,
  verifyTotpCode,
} from '@nginda-warriors/shared/server';

export async function GET(req: NextRequest) {
  const bootstrapped = isSystemBootstrapped();
  const token = extractAdminToken(req);
  const session = verifyAdminSessionToken(token);

  return NextResponse.json({
    ok: true,
    bootstrapped,
    session,
  });
}

export async function POST(req: NextRequest) {
  try {
    assertValidCsrfOrigin(req.headers);

    const body = await req.json();
    const { action } = body;

    const host = req.headers.get('host') || '';
    const isSecure =
      process.env.NODE_ENV === 'production' &&
      !host.includes('localhost') &&
      !host.includes('127.0.0.1');

    if (action === 'bootstrap_owner') {
      const { user, token } = bootstrapOwnerSuperAdmin({
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        setupToken: body.setupToken,
      });

      const res = NextResponse.json({
        ok: true,
        user,
        token,
        message: 'Primary Super Administrator ownership established successfully.',
      });

      res.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    if (action === 'login') {
      const clientIp = getSafeClientIp(req.headers);

      // If no admin user exists yet, automatically initialize the first owner with these credentials
      if (!isSystemBootstrapped()) {
        const fallbackName =
          body.fullName ||
          (body.email
            ? body.email
                .split('@')[0]
                .replace(/[._-]/g, ' ')
                .replace(/\b\w/g, (c: string) => c.toUpperCase())
            : 'Club Super Admin');

        const { user, token } = bootstrapOwnerSuperAdmin({
          fullName: fallbackName,
          email: body.email,
          password: body.password,
          setupToken: body.setupToken,
        });

        const res = NextResponse.json({
          ok: true,
          user,
          token,
          message: 'Primary Super Administrator established and signed in successfully.',
        });

        res.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
          httpOnly: true,
          secure: isSecure,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 12,
        });
        return res;
      }

      const { user, token } = authenticateAdminUser({
        email: body.email,
        password: body.password,
        clientIp,
      });

      if (user.mfaEnabled && user.mfaSecret) {
        if (!body.mfaCode || !verifyTotpCode(user.mfaSecret, body.mfaCode)) {
          return NextResponse.json(
            { ok: false, error: 'Valid 6-digit MFA verification code required.', mfaRequired: true },
            { status: 403 }
          );
        }
      }

      const res = NextResponse.json({
        ok: true,
        user,
        token,
        message: 'Signed in to Nginda Warriors Control Centre.',
      });

      res.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    if (action === 'logout') {
      const token = extractAdminToken(req);
      const session = verifyAdminSessionToken(token);
      if (session) {
        revokeUserSessions(session.userId);
      }
      const res = NextResponse.json({ ok: true, message: 'Logged out and session revoked.' });
      res.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
      return res;
    }

    return NextResponse.json({ ok: false, error: 'Unsupported auth action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
