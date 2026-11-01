import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, getDatabaseTimestamp } from '@nginda-warriors/shared/server';

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

    const freshDb = readDatabase();
    return NextResponse.json(
      {
        ok: true,
        synced: true,
        updatedAt: getDatabaseTimestamp(),
        fixturesCount: freshDb.fixtures.length,
        playersCount: freshDb.players.length,
        articlesCount: freshDb.articles.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database sync failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(
    {
      ok: true,
      updatedAt: getDatabaseTimestamp(),
      fixturesCount: db.fixtures.length,
      playersCount: db.players.length,
      articlesCount: db.articles.length,
      status: 'ready',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
