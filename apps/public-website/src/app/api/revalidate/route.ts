import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  readDatabase,
  writeDatabase,
  extractAdminToken,
  verifyAdminSessionToken,
} from '@nginda-warriors/shared/server';

function isAuthorizedRevalidateRequest(req: NextRequest): boolean {
  const syncSecret = req.headers.get('x-sync-secret');
  const configuredSecret =
    process.env.ADMIN_JWT_SECRET || 'nginda-warriors-fc-control-centre-server-jwt-secret-key-2024';
  if (syncSecret && syncSecret === configuredSecret) {
    return true;
  }
  const token = extractAdminToken(req);
  if (token) {
    const session = verifyAdminSessionToken(token);
    if (session && session.userId && session.roleCode) {
      return true;
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedRevalidateRequest(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized: Admin authentication or internal sync secret required.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    if (body.database && typeof body.database === 'object') {
      writeDatabase(body.database);
    } else if (body.fixture && typeof body.fixture === 'object') {
      const db = readDatabase();
      const idx = db.fixtures.findIndex((f) => f.id === body.fixture.id);
      if (idx >= 0) {
        db.fixtures[idx] = body.fixture;
      } else {
        db.fixtures.unshift(body.fixture);
      }
      writeDatabase(db);
    }

    const targetPath = typeof body.path === 'string' ? body.path : '/';
    revalidatePath('/', 'layout');
    revalidatePath('/fixtures');
    revalidatePath('/standings');
    revalidatePath('/team');
    revalidatePath('/about');
    revalidatePath('/news');
    revalidatePath('/gallery');
    revalidatePath('/events');
    revalidatePath('/sponsors');
    revalidatePath('/merchandise');
    revalidatePath('/support');
    revalidatePath('/transparency');
    revalidatePath(targetPath);
    return NextResponse.json({ ok: true, revalidated: targetPath });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Revalidation failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
