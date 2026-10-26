import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE_NAME,
  authenticateAdminUser,
  bootstrapOwnerSuperAdmin,
  isSystemBootstrapped,
  verifyAdminSessionToken,
} from '@nginda-warriors/shared/server';

export async function GET(req: NextRequest) {
  const bootstrapped = isSystemBootstrapped();
  const token = req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);

  return NextResponse.json({
    ok: true,
    bootstrapped,
    session,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

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
        message: 'Primary Super Administrator ownership established successfully.',
      });

      res.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    if (action === 'login') {
      const clientIp = req.headers.get('x-forwarded-for') || 'local';
      const { user, token } = authenticateAdminUser({
        email: body.email,
        password: body.password,
        clientIp,
      });

      const res = NextResponse.json({
        ok: true,
        user,
        message: 'Signed in to Nginda Warriors Control Centre.',
      });

      res.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    if (action === 'logout') {
      const res = NextResponse.json({ ok: true, message: 'Logged out.' });
      res.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
      return res;
    }

    return NextResponse.json({ ok: false, error: 'Unsupported auth action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
