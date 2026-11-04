import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  readDatabase,
  writeDatabase,
  getDatabaseTimestamp,
  getPublicWebsiteSnapshot,
  extractAdminToken,
  verifyAdminSessionToken,
  deduplicatePlayers,
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
      const safePlayers = deduplicatePlayers(
        [...incomingPlayers, ...(currentDb.players || [])],
        deletedSet
      );

      const nextDb = {
        ...currentDb,
        ...body.database,
        players: safePlayers,
        deletedPlayerIds: mergedDeleted,
        fixtures: Array.isArray(body.database.fixtures)
          ? body.database.fixtures
          : currentDb.fixtures || [],
        articles: Array.isArray(body.database.articles)
          ? body.database.articles
          : currentDb.articles || [],
      };
      writeDatabase(nextDb);
    } else if (body.deletedPlayerId) {
      const db = readDatabase();
      const targetId = String(body.deletedPlayerId);
      db.deletedPlayerIds = Array.from(new Set([...(db.deletedPlayerIds || []), targetId]));
      db.players = (db.players || []).filter((p) => p.id !== targetId);
      writeDatabase(db);
    } else if (body.player && typeof body.player === 'object' && body.player.id) {
      const db = readDatabase();
      db.players = Array.isArray(db.players) ? db.players : [];
      if (db.deletedPlayerIds) {
        db.deletedPlayerIds = db.deletedPlayerIds.filter((id) => id !== body.player.id);
      }
      db.players = deduplicatePlayers([body.player, ...db.players], db.deletedPlayerIds);
      writeDatabase(db);
    } else if (Array.isArray(body.players)) {
      const db = readDatabase();
      db.players = deduplicatePlayers(body.players, db.deletedPlayerIds);
      writeDatabase(db);
    } else if (body.fixture && typeof body.fixture === 'object' && body.fixture.id) {
      const db = readDatabase();
      db.fixtures = Array.isArray(db.fixtures) ? db.fixtures : [];
      const idx = db.fixtures.findIndex((f) => f.id === body.fixture.id);
      if (idx >= 0) {
        db.fixtures[idx] = body.fixture;
      } else {
        db.fixtures.unshift(body.fixture);
      }
      writeDatabase(db);
    }

    try {
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
    } catch {}

    const freshDb = readDatabase();
    const freshSnapshot = getPublicWebsiteSnapshot();
    return NextResponse.json(
      {
        ok: true,
        synced: true,
        updatedAt: getDatabaseTimestamp(),
        snapshot: freshSnapshot,
        database: freshDb,
        fixturesCount: freshDb.fixtures?.length ?? 0,
        playersCount: freshDb.players?.length ?? 0,
        articlesCount: freshDb.articles?.length ?? 0,
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

export async function GET(req: NextRequest) {
  const currentTs = getDatabaseTimestamp();
  const since = req.nextUrl?.searchParams?.get('since');
  if (since && !isNaN(Number(since)) && Number(since) >= currentTs) {
    return NextResponse.json(
      {
        ok: true,
        changed: false,
        updatedAt: currentTs,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }

  const snapshot = getPublicWebsiteSnapshot();
  return NextResponse.json(
    {
      ok: true,
      changed: true,
      updatedAt: currentTs,
      snapshot,
      fixturesCount: snapshot.fixtures?.length ?? 0,
      playersCount: snapshot.players?.length ?? 0,
      articlesCount: snapshot.articles?.length ?? 0,
      status: 'ready',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
