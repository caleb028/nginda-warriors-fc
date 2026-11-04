import { NextRequest, NextResponse } from 'next/server';
import {
  readDatabase,
  writeDatabase,
  getDatabaseTimestamp,
  extractAdminToken,
  verifyAdminSessionToken,
} from '@nginda-warriors/shared/server';

const HYPOTHETICAL_PLAYER_IDS = new Set([
  'player-collins-kariuki-1',
  'player-kelvin-njoroge-4',
  'player-brian-mwangi-7',
  'player-dennis-kamau-11',
]);

function isAuthorizedSyncRequest(req: NextRequest): boolean {
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
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized: Admin authentication or internal sync secret required.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    if (body.database && typeof body.database === 'object') {
      const currentDb = readDatabase();
      const mergedDeleted = Array.from(
        new Set([
          ...(currentDb.deletedPlayerIds || []),
          ...(body.database.deletedPlayerIds || []),
        ])
      );
      const incomingPlayers = Array.isArray(body.database.players)
        ? body.database.players
        : [];
      const deletedSet = new Set(mergedDeleted);
      const playerMap = new Map<string, any>();
      for (const p of currentDb.players || []) {
        if (p && p.id && !deletedSet.has(p.id) && !HYPOTHETICAL_PLAYER_IDS.has(p.id)) {
          playerMap.set(p.id, p);
        }
      }
      for (const p of incomingPlayers) {
        if (p && p.id && !deletedSet.has(p.id) && !HYPOTHETICAL_PLAYER_IDS.has(p.id)) {
          playerMap.set(p.id, p);
        }
      }
      const safePlayers = Array.from(playerMap.values());
      const nextDb = {
        ...currentDb,
        ...body.database,
        players: safePlayers,
        deletedPlayerIds: mergedDeleted,
      };
      writeDatabase(nextDb);
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
