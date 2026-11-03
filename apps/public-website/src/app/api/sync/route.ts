import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  readDatabase,
  writeDatabase,
  getDatabaseTimestamp,
  getPublicWebsiteSnapshot,
} from '@nginda-warriors/shared/server';

const HYPOTHETICAL_PLAYER_IDS = new Set([
  'player-collins-kariuki-1',
  'player-kelvin-njoroge-4',
  'player-brian-mwangi-7',
  'player-dennis-kamau-11',
]);

export async function POST(req: NextRequest) {
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
      // If player was previously deleted, un-tombstone it upon deliberate re-creation
      if (db.deletedPlayerIds) {
        db.deletedPlayerIds = db.deletedPlayerIds.filter((id) => id !== body.player.id);
      }
      const idx = db.players.findIndex((p) => p.id === body.player.id);
      if (idx >= 0) {
        db.players[idx] = body.player;
      } else {
        db.players.push(body.player);
      }
      writeDatabase(db);
    } else if (Array.isArray(body.players)) {
      const db = readDatabase();
      db.players = body.players;
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

export async function GET() {
  const db = readDatabase();
  const snapshot = getPublicWebsiteSnapshot();
  return NextResponse.json(
    {
      ok: true,
      updatedAt: getDatabaseTimestamp(),
      snapshot,
      database: db,
      fixturesCount: db.fixtures?.length ?? 0,
      playersCount: db.players?.length ?? 0,
      articlesCount: db.articles?.length ?? 0,
      status: 'ready',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
