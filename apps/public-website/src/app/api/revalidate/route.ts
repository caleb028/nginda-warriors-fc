import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDatabase, writeDatabase } from '@nginda-warriors/shared/server';

export async function POST(req: NextRequest) {
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
    revalidatePath(targetPath);
    return NextResponse.json({ ok: true, revalidated: targetPath });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Revalidation failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
