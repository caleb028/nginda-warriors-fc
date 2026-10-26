import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  ADMIN_SESSION_COOKIE_NAME,
  AdminRoleCode,
  assertAuthorizedAdmin,
  createUuid,
  readDatabase,
  recalculateStandingsFromVerifiedFixtures,
  reconcileMpesaTransaction,
  recordAuditLog,
  slugify,
  verifyAdminSessionToken,
  writeDatabase,
} from '@nginda-warriors/shared/server';

async function saveDatabaseAndSync(db: Parameters<typeof writeDatabase>[0], path: string = '/') {
  writeDatabase(db);
  const publicUrl = process.env.PUBLIC_WEBSITE_URL;
  if (publicUrl) {
    try {
      await fetch(new URL('/api/revalidate', publicUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    } catch {
      // Non-blocking sync call across internal service binding
    }
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'UNAUTHORIZED: Control Centre authentication required.' },
      { status: 401 }
    );
  }

  const db = readDatabase();
  const safeUsers = db.users.map(({ passwordHash: _pw, ...u }) => u);

  return NextResponse.json({
    ok: true,
    session,
    publicWebsiteUrl: process.env.PUBLIC_WEBSITE_URL || '/',
    database: {
      ...db,
      users: safeUsers,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    const body = await req.json();
    const { action, payload } = body;

    // 1. PLAYERS MANAGEMENT
    if (action === 'save_player') {
      const session = assertAuthorizedAdmin(token, 'players');
      const db = readDatabase();
      const now = new Date().toISOString();
      const existingIdx = payload.id
        ? db.players.findIndex((p) => p.id === payload.id)
        : -1;

      const playerRecord = {
        id: existingIdx >= 0 ? db.players[existingIdx].id : createUuid(),
        slug:
          payload.slug ||
          `${slugify(payload.fullName)}-${payload.jerseyNumber}`,
        fullName: String(payload.fullName).trim(),
        jerseyNumber: Number(payload.jerseyNumber),
        positionGroup: payload.positionGroup || 'Midfielders',
        specificRole: payload.specificRole || 'Central Midfielder',
        photoUrl: payload.photoUrl || '',
        biography:
          payload.biography ||
          `Official squad player for Nginda Warriors FC.`,
        preferredFoot: payload.preferredFoot || 'Right',
        isUnderageProtected: Boolean(payload.isUnderageProtected),
        appearances: Number(payload.appearances || 0),
        starts: Number(payload.starts || 0),
        goals: Number(payload.goals || 0),
        assists: Number(payload.assists || 0),
        yellowCards: Number(payload.yellowCards || 0),
        redCards: Number(payload.redCards || 0),
        cleanSheets: Number(payload.cleanSheets || 0),
        seasonStats: Array.isArray(payload.seasonStats) ? payload.seasonStats : [],
        isFeatured: Boolean(payload.isFeatured),
        squadStatus: payload.squadStatus || 'active',
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: existingIdx >= 0 ? db.players[existingIdx].createdAt : now,
        updatedAt: now,
      };

      if (existingIdx >= 0) {
        db.players[existingIdx] = playerRecord;
      } else {
        db.players.push(playerRecord);
      }

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: existingIdx >= 0 ? 'UPDATE_PLAYER' : 'CREATE_PLAYER',
        module: 'players',
        targetId: playerRecord.id,
        summary: `${existingIdx >= 0 ? 'Updated' : 'Added'} player #${playerRecord.jerseyNumber} ${playerRecord.fullName} (${playerRecord.publicationStatus})`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, player: playerRecord });
    }

    if (action === 'delete_player') {
      const session = assertAuthorizedAdmin(token, 'players');
      const db = readDatabase();
      const target = db.players.find((p) => p.id === payload.id);
      db.players = db.players.filter((p) => p.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_PLAYER',
        module: 'players',
        targetId: payload.id,
        summary: `Removed player profile ${target?.fullName || payload.id}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    // 2. TECHNICAL STAFF & CLUB LEADERSHIP
    if (action === 'save_staff') {
      const session = assertAuthorizedAdmin(token, 'staff');
      const db = readDatabase();
      const now = new Date().toISOString();
      const idx = payload.id ? db.staff.findIndex((s) => s.id === payload.id) : -1;

      const staffRecord = {
        id: idx >= 0 ? db.staff[idx].id : createUuid(),
        fullName: String(payload.fullName).trim(),
        roleTitle: String(payload.roleTitle).trim(),
        category: payload.category || 'Technical Bench',
        photoUrl: payload.photoUrl || '',
        biography: payload.biography || '',
        publicEmail: payload.publicEmail || '',
        publicPhone: payload.publicPhone || '',
        displayOrder: Number(payload.displayOrder || db.staff.length + 1),
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: idx >= 0 ? db.staff[idx].createdAt : now,
        updatedAt: now,
      };

      if (idx >= 0) {
        db.staff[idx] = staffRecord;
      } else {
        db.staff.push(staffRecord);
      }

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'SAVE_STAFF_PROFILE',
        module: 'staff',
        targetId: staffRecord.id,
        summary: `Saved ${staffRecord.category} profile: ${staffRecord.fullName} (${staffRecord.roleTitle})`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, staff: staffRecord });
    }

    if (action === 'delete_staff') {
      const session = assertAuthorizedAdmin(token, 'staff');
      const db = readDatabase();
      db.staff = db.staff.filter((s) => s.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_STAFF_PROFILE',
        module: 'staff',
        targetId: payload.id,
        summary: `Deleted staff record ${payload.id}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    // 3. FIXTURES, RESULTS & 60-SECOND MOBILE SCORE UPDATER
    if (action === 'save_fixture') {
      const session = assertAuthorizedAdmin(token, 'fixtures');
      const db = readDatabase();
      const now = new Date().toISOString();
      const idx = payload.id ? db.fixtures.findIndex((f) => f.id === payload.id) : -1;

      const fixtureRecord = {
        id: idx >= 0 ? db.fixtures[idx].id : createUuid(),
        competitionName: payload.competitionName || 'FKF Regional League',
        seasonName: payload.seasonName || '2026/2027 Season',
        opponentName: String(payload.opponentName).trim(),
        opponentCrestUrl: payload.opponentCrestUrl || '',
        venue: String(payload.venue).trim(),
        isHome: payload.isHome !== undefined ? Boolean(payload.isHome) : true,
        kickoffAt: payload.kickoffAt || now,
        timezone: 'Africa/Nairobi',
        matchStatus: payload.matchStatus || 'scheduled',
        homeScore:
          payload.homeScore !== undefined && payload.homeScore !== '' && payload.homeScore !== null
            ? Number(payload.homeScore)
            : idx >= 0
            ? db.fixtures[idx].homeScore
            : null,
        awayScore:
          payload.awayScore !== undefined && payload.awayScore !== '' && payload.awayScore !== null
            ? Number(payload.awayScore)
            : idx >= 0
            ? db.fixtures[idx].awayScore
            : null,
        motmVotingOpen: Boolean(payload.motmVotingOpen),
        publicationStatus: payload.publicationStatus || 'published',
        events: idx >= 0 ? db.fixtures[idx].events : [],
        lineups: idx >= 0 ? db.fixtures[idx].lineups : [],
        report: idx >= 0 ? db.fixtures[idx].report : null,
        createdAt: idx >= 0 ? db.fixtures[idx].createdAt : now,
        updatedAt: now,
      };

      if (idx >= 0) {
        db.fixtures[idx] = fixtureRecord;
      } else {
        db.fixtures.unshift(fixtureRecord);
      }

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: idx >= 0 ? 'UPDATE_FIXTURE' : 'CREATE_FIXTURE',
        module: 'fixtures',
        targetId: fixtureRecord.id,
        summary: `${idx >= 0 ? 'Updated' : 'Created'} fixture vs ${fixtureRecord.opponentName} (${fixtureRecord.publicationStatus})`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, fixture: fixtureRecord });
    }

    if (action === 'delete_fixture') {
      const session = assertAuthorizedAdmin(token, 'fixtures');
      const db = readDatabase();
      const target = db.fixtures.find((f) => f.id === payload.id);
      db.fixtures = db.fixtures.filter((f) => f.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_FIXTURE',
        module: 'fixtures',
        targetId: payload.id,
        summary: `Deleted fixture: Nginda Warriors vs ${target?.opponentName || payload.id}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'clear_fixture_result') {
      const session = assertAuthorizedAdmin(token, 'match-centre');
      const db = readDatabase();
      const fixture = db.fixtures.find((f) => f.id === payload.fixtureId);
      if (!fixture) {
        return NextResponse.json({ ok: false, error: 'Fixture not found.' }, { status: 404 });
      }
      fixture.homeScore = null;
      fixture.awayScore = null;
      fixture.matchStatus = 'scheduled';
      fixture.events = [];
      fixture.report = undefined;
      fixture.updatedAt = new Date().toISOString();
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CLEAR_FIXTURE_RESULT',
        module: 'match-centre',
        targetId: fixture.id,
        summary: `Cleared match score & result for vs ${fixture.opponentName}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, fixture });
    }

    if (action === 'quick_update_score') {
      const session = assertAuthorizedAdmin(token, 'match-centre');
      const db = readDatabase();
      const fixture = db.fixtures.find((f) => f.id === payload.fixtureId);
      if (!fixture) {
        return NextResponse.json({ ok: false, error: 'Fixture not found.' }, { status: 404 });
      }

      fixture.homeScore = Number(payload.homeScore ?? fixture.homeScore ?? 0);
      fixture.awayScore = Number(payload.awayScore ?? fixture.awayScore ?? 0);
      if (payload.matchStatus) {
        fixture.matchStatus = payload.matchStatus;
      }
      if (payload.publicationStatus) {
        fixture.publicationStatus = payload.publicationStatus;
      }
      fixture.updatedAt = new Date().toISOString();

      if (payload.scorerName) {
        fixture.events.push({
          id: createUuid(),
          fixtureId: fixture.id,
          minute: Number(payload.minute || 45),
          teamSide: payload.teamSide || 'nginda',
          eventType: payload.eventType || 'goal',
          playerName: String(payload.scorerName).trim(),
          secondaryPlayerName: payload.secondaryPlayerName || undefined,
          notes: payload.notes || undefined,
          createdAt: new Date().toISOString(),
        });
      }

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'QUICK_SCORE_UPDATE',
        module: 'match-centre',
        targetId: fixture.id,
        summary: `Updated score vs ${fixture.opponentName}: ${fixture.homeScore} - ${fixture.awayScore} (${fixture.matchStatus})`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, fixture });
    }

    if (action === 'save_match_report') {
      const session = assertAuthorizedAdmin(token, 'match-centre');
      const db = readDatabase();
      const fixture = db.fixtures.find((f) => f.id === payload.fixtureId);
      if (!fixture) {
        return NextResponse.json({ ok: false, error: 'Fixture not found.' }, { status: 404 });
      }
      fixture.report = {
        id: fixture.report?.id || createUuid(),
        fixtureId: fixture.id,
        headline: String(payload.headline).trim(),
        summary: String(payload.summary).trim(),
        body: String(payload.body).trim(),
        authorName: session.fullName,
        publishedAt: new Date().toISOString(),
      };
      fixture.updatedAt = new Date().toISOString();

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'SAVE_MATCH_REPORT',
        module: 'match-centre',
        targetId: fixture.id,
        summary: `Published match report for fixture vs ${fixture.opponentName}`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, fixture });
    }

    if (action === 'add_lineup_entry') {
      const session = assertAuthorizedAdmin(token, 'match-centre');
      const db = readDatabase();
      const fixture = db.fixtures.find((f) => f.id === payload.fixtureId);
      if (!fixture) {
        return NextResponse.json({ ok: false, error: 'Fixture not found.' }, { status: 404 });
      }
      fixture.lineups.push({
        id: createUuid(),
        fixtureId: fixture.id,
        playerId: payload.playerId || undefined,
        playerName: String(payload.playerName).trim(),
        jerseyNumber: Number(payload.jerseyNumber),
        position: String(payload.position || 'MID'),
        isStarting: payload.isStarting !== false,
        isCaptain: Boolean(payload.isCaptain),
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, fixture });
    }

    // 4. COMPETITIONS & LEAGUE STANDINGS
    if (action === 'save_competition') {
      const session = assertAuthorizedAdmin(token, 'competitions');
      const db = readDatabase();
      const comp = {
        id: createUuid(),
        name: String(payload.name).trim(),
        shortName: payload.shortName || String(payload.name).trim(),
        seasonId: db.seasons[0]?.id || '',
        seasonName: payload.seasonName || '2026/2027 Season',
        competitionType: payload.competitionType || 'league',
        pointsForWin: Number(payload.pointsForWin ?? 3),
        pointsForDraw: Number(payload.pointsForDraw ?? 1),
        pointsForLoss: Number(payload.pointsForLoss ?? 0),
        tiebreakerRules:
          payload.tiebreakerRules || 'Points > Goal Difference > Goals For',
        isVerifiedSource: Boolean(payload.isVerifiedSource),
        verificationNote: payload.verificationNote || '',
        isActive: true,
      };
      db.competitions.push(comp);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CREATE_COMPETITION',
        module: 'competitions',
        targetId: comp.id,
        summary: `Added competition ${comp.name} (${comp.seasonName})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, competition: comp });
    }

    if (action === 'delete_competition') {
      const session = assertAuthorizedAdmin(token, 'competitions');
      const db = readDatabase();
      const target = db.competitions.find((c) => c.id === payload.id);
      db.competitions = db.competitions.filter((c) => c.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_COMPETITION',
        module: 'competitions',
        targetId: payload.id,
        summary: `Deleted competition ${target?.name || payload.id}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'save_standing_row') {
      const session = assertAuthorizedAdmin(token, 'standings');
      const db = readDatabase();
      const won = Number(payload.won || 0);
      const drawn = Number(payload.drawn || 0);
      const lost = Number(payload.lost || 0);
      const played = Number(payload.played ?? won + drawn + lost);
      const gf = Number(payload.goalsFor || 0);
      const ga = Number(payload.goalsAgainst || 0);
      const gd = gf - ga;
      const pts =
        payload.points !== undefined && payload.points !== ''
          ? Number(payload.points)
          : won * 3 + drawn;

      const idx = payload.id ? db.standings.findIndex((s) => s.id === payload.id) : -1;
      const row = {
        id: idx >= 0 ? db.standings[idx].id : createUuid(),
        competitionName: payload.competitionName || 'FKF Regional League',
        seasonName: payload.seasonName || '2026/2027 Season',
        position: Number(payload.position || db.standings.length + 1),
        clubName: String(payload.clubName).trim(),
        isNgindaWarriors:
          Boolean(payload.isNgindaWarriors) ||
          String(payload.clubName).toLowerCase().includes('nginda warriors'),
        played,
        won,
        drawn,
        lost,
        goalsFor: gf,
        goalsAgainst: ga,
        goalDifference: gd,
        points: pts,
        publicationStatus: payload.publicationStatus || 'published',
        updatedAt: new Date().toISOString(),
      };

      if (idx >= 0) {
        db.standings[idx] = row;
      } else {
        db.standings.push(row);
      }

      db.standings.sort((a, b) => a.position - b.position);

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'SAVE_STANDING_ROW',
        module: 'standings',
        targetId: row.id,
        summary: `Saved standing #${row.position} ${row.clubName} (${row.points} PTS)`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, row });
    }

    if (action === 'auto_calculate_standings') {
      const session = assertAuthorizedAdmin(token, 'standings');
      const db = readDatabase();
      const rows = recalculateStandingsFromVerifiedFixtures(
        db,
        payload.competitionName || 'FKF Regional League',
        payload.seasonName || '2026/2027 Season'
      );
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'AUTO_CALCULATE_STANDINGS',
        module: 'standings',
        summary: `Calculated league standings from verified fulltime results (${rows.length} clubs)`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, rows });
    }

    if (action === 'delete_standing_row') {
      const session = assertAuthorizedAdmin(token, 'standings');
      const db = readDatabase();
      const target = db.standings.find((s) => s.id === payload.id);
      db.standings = db.standings.filter((s) => s.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_STANDING_ROW',
        module: 'standings',
        targetId: payload.id,
        summary: `Deleted standing row for ${target?.clubName || payload.id}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'clear_all_standings') {
      const session = assertAuthorizedAdmin(token, 'standings');
      const db = readDatabase();
      db.standings = [];
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CLEAR_ALL_STANDINGS',
        module: 'standings',
        targetId: 'all',
        summary: 'Cleared all league standings rows',
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    // 5. NEWS & CONTENT MANAGEMENT
    if (action === 'save_article') {
      const session = assertAuthorizedAdmin(token, 'news');
      const db = readDatabase();
      const now = new Date().toISOString();
      const idx = payload.id ? db.articles.findIndex((a) => a.id === payload.id) : -1;

      const status = payload.publicationStatus || 'draft';
      const article = {
        id: idx >= 0 ? db.articles[idx].id : createUuid(),
        slug: payload.slug || slugify(payload.headline),
        headline: String(payload.headline).trim(),
        excerpt: String(payload.excerpt).trim(),
        body: String(payload.body).trim(),
        categoryName: payload.categoryName || 'Club announcements',
        featuredImageUrl: payload.featuredImageUrl || '',
        authorName: payload.authorName || session.fullName,
        seoTitle: payload.seoTitle || String(payload.headline).trim(),
        seoDescription: payload.seoDescription || String(payload.excerpt).trim(),
        scheduledFor: payload.scheduledFor || undefined,
        publishedAt: status === 'published' ? now : undefined,
        publicationStatus: status,
        createdAt: idx >= 0 ? db.articles[idx].createdAt : now,
        updatedAt: now,
      };

      if (idx >= 0) {
        db.articles[idx] = article;
      } else {
        db.articles.unshift(article);
      }

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: idx >= 0 ? 'UPDATE_ARTICLE' : 'CREATE_ARTICLE',
        module: 'news',
        targetId: article.id,
        summary: `Saved article "${article.headline}" (status: ${article.publicationStatus})`,
      });

      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, article });
    }

    if (action === 'delete_article') {
      const session = assertAuthorizedAdmin(token, 'news');
      const db = readDatabase();
      const target = db.articles.find((a) => a.id === payload.id);
      db.articles = db.articles.filter((a) => a.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_ARTICLE',
        module: 'news',
        targetId: payload.id,
        summary: `Deleted news article "${target?.headline || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    // 6. GALLERY, MEDIA & EVENTS
    if (action === 'save_media_asset') {
      const session = assertAuthorizedAdmin(token, 'gallery');
      const db = readDatabase();
      const asset = {
        id: createUuid(),
        title: String(payload.title).trim(),
        caption: String(payload.caption || '').trim(),
        category: payload.category || 'Matches',
        mediaType: payload.mediaType || 'image',
        url: String(payload.url || '').trim(),
        externalVideoUrl: payload.externalVideoUrl || undefined,
        displayOrder: Number(payload.displayOrder || db.mediaAssets.length + 1),
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: new Date().toISOString(),
      };
      db.mediaAssets.unshift(asset);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPLOAD_MEDIA_ASSET',
        module: 'gallery',
        targetId: asset.id,
        summary: `Added ${asset.mediaType} "${asset.title}" to ${asset.category}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, asset });
    }

    if (action === 'delete_media_asset') {
      const session = assertAuthorizedAdmin(token, 'gallery');
      const db = readDatabase();
      const target = db.mediaAssets.find((m) => m.id === payload.id);
      db.mediaAssets = db.mediaAssets.filter((m) => m.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_MEDIA_ASSET',
        module: 'gallery',
        targetId: payload.id,
        summary: `Deleted media asset "${target?.title || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'save_event') {
      const session = assertAuthorizedAdmin(token, 'events');
      const db = readDatabase();
      const eventItem = {
        id: createUuid(),
        title: String(payload.title).trim(),
        category: payload.category || 'Community Outreach',
        description: String(payload.description).trim(),
        location: String(payload.location).trim(),
        startsAt: payload.startsAt || new Date().toISOString(),
        registrationRequired: Boolean(payload.registrationRequired),
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: new Date().toISOString(),
      };
      db.events.unshift(eventItem);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CREATE_CLUB_EVENT',
        module: 'events',
        targetId: eventItem.id,
        summary: `Created event "${eventItem.title}" (${eventItem.publicationStatus})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, event: eventItem });
    }

    if (action === 'delete_event') {
      const session = assertAuthorizedAdmin(token, 'events');
      const db = readDatabase();
      const target = db.events.find((e) => e.id === payload.id);
      db.events = db.events.filter((e) => e.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_EVENT',
        module: 'events',
        targetId: payload.id,
        summary: `Deleted event "${target?.title || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    // 7. SPONSORS, INQUIRIES & SPONSORSHIP PACKAGES
    if (action === 'save_sponsor') {
      const session = assertAuthorizedAdmin(token, 'sponsors');
      const db = readDatabase();
      const idx = payload.id ? db.sponsors.findIndex((s) => s.id === payload.id) : -1;
      const sponsor = {
        id: idx >= 0 ? db.sponsors[idx].id : createUuid(),
        businessName: String(payload.businessName).trim(),
        tierCode: payload.tierCode || 'GOLD',
        logoUrl: String(payload.logoUrl || '').trim(),
        websiteUrl: payload.websiteUrl || '',
        summary: String(payload.summary || '').trim(),
        agreementStart: payload.agreementStart || '',
        agreementExpiry: payload.agreementExpiry || '',
        isApproved: Boolean(payload.isApproved),
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: idx >= 0 ? db.sponsors[idx].createdAt : new Date().toISOString(),
      };
      if (idx >= 0) {
        db.sponsors[idx] = sponsor;
      } else {
        db.sponsors.unshift(sponsor);
      }
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'SAVE_SPONSOR',
        module: 'sponsors',
        targetId: sponsor.id,
        summary: `Saved sponsor ${sponsor.businessName} (Approved: ${sponsor.isApproved}, Status: ${sponsor.publicationStatus})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, sponsor });
    }

    if (action === 'delete_sponsor') {
      const session = assertAuthorizedAdmin(token, 'sponsors');
      const db = readDatabase();
      const target = db.sponsors.find((s) => s.id === payload.id);
      db.sponsors = db.sponsors.filter((s) => s.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_SPONSOR',
        module: 'sponsors',
        targetId: payload.id,
        summary: `Deleted sponsor "${target?.businessName || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'update_sponsor_inquiry') {
      const session = assertAuthorizedAdmin(token, 'sponsor-inquiries');
      const db = readDatabase();
      const inquiry = db.sponsorInquiries.find((i) => i.id === payload.id);
      if (!inquiry) {
        return NextResponse.json({ ok: false, error: 'Inquiry not found.' }, { status: 404 });
      }
      if (payload.inquiryStatus) inquiry.inquiryStatus = payload.inquiryStatus;
      if (payload.privateAdminNotes !== undefined) {
        inquiry.privateAdminNotes = payload.privateAdminNotes;
      }
      inquiry.updatedAt = new Date().toISOString();

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPDATE_SPONSOR_INQUIRY',
        module: 'sponsor-inquiries',
        targetId: inquiry.id,
        summary: `Updated inquiry from ${inquiry.businessName} to ${inquiry.inquiryStatus}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, inquiry });
    }

    if (action === 'save_sponsorship_package') {
      const session = assertAuthorizedAdmin(token, 'sponsorship-packages');
      const db = readDatabase();
      const pkg = db.sponsorshipPackages.find((p) => p.id === payload.id || p.tierCode === payload.tierCode);
      if (!pkg) {
        return NextResponse.json({ ok: false, error: 'Package not found.' }, { status: 404 });
      }
      pkg.name = payload.name || pkg.name;
      pkg.priceKes =
        payload.priceKes === null || payload.priceKes === ''
          ? null
          : Number(payload.priceKes);
      pkg.description = payload.description || pkg.description;
      if (Array.isArray(payload.benefits)) {
        pkg.benefits = payload.benefits;
      }
      if (payload.publicationStatus) {
        pkg.publicationStatus = payload.publicationStatus;
      }
      pkg.updatedAt = new Date().toISOString();

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPDATE_SPONSORSHIP_PACKAGE',
        module: 'sponsorship-packages',
        targetId: pkg.id,
        summary: `Updated ${pkg.tierCode} sponsorship package (Price KES: ${pkg.priceKes ?? 'Unset'})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, package: pkg });
    }

    if (action === 'delete_sponsorship_package') {
      const session = assertAuthorizedAdmin(token, 'sponsorship-packages');
      const db = readDatabase();
      const target = db.sponsorshipPackages.find((p) => p.id === payload.id);
      db.sponsorshipPackages = db.sponsorshipPackages.filter((p) => p.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_SPONSORSHIP_PACKAGE',
        module: 'sponsorship-packages',
        targetId: payload.id,
        summary: `Deleted sponsorship package "${target?.tierCode || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    // 8. FUNDRAISING, M-PESA DONATIONS & FINANCIAL TRANSPARENCY
    if (action === 'save_campaign') {
      const session = assertAuthorizedAdmin(token, 'fundraising');
      const db = readDatabase();
      const now = new Date().toISOString();
      const campaign = {
        id: createUuid(),
        title: String(payload.title).trim(),
        category: payload.category || 'Playing kits',
        description: String(payload.description).trim(),
        targetAmountKes: Number(payload.targetAmountKes || 0),
        verifiedRaisedKes: Number(payload.verifiedRaisedKes || 0),
        deadline: payload.deadline || '',
        accountReference:
          payload.accountReference ||
          `WARRIORS-${slugify(payload.title).slice(0, 8).toUpperCase()}`,
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: now,
        updatedAt: now,
      };
      db.fundraisingCampaigns.unshift(campaign);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CREATE_FUNDRAISING_CAMPAIGN',
        module: 'fundraising',
        targetId: campaign.id,
        summary: `Launched campaign "${campaign.title}" (Target: KES ${campaign.targetAmountKes})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, campaign });
    }

    if (action === 'delete_campaign') {
      const session = assertAuthorizedAdmin(token, 'fundraising');
      const db = readDatabase();
      const target = db.fundraisingCampaigns.find((c) => c.id === payload.id);
      db.fundraisingCampaigns = db.fundraisingCampaigns.filter((c) => c.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_CAMPAIGN',
        module: 'fundraising',
        targetId: payload.id,
        summary: `Deleted fundraising campaign "${target?.title || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'reconcile_donation') {
      const session = assertAuthorizedAdmin(token, 'donations');
      const updated = reconcileMpesaTransaction({
        donationId: payload.donationId,
        newStatus: payload.newStatus,
        mpesaReceiptNumber: payload.mpesaReceiptNumber,
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode as 'SUPER_ADMIN' | 'FINANCE_MANAGER' | 'CLUB_ADMIN',
      });
      return NextResponse.json({ ok: true, donation: updated });
    }

    if (action === 'save_expenditure') {
      const session = assertAuthorizedAdmin(token, 'transparency');
      const db = readDatabase();
      const exp = {
        id: createUuid(),
        campaignId: payload.campaignId || undefined,
        category: String(payload.category || 'Football equipment'),
        description: String(payload.description).trim(),
        amountKes: Number(payload.amountKes),
        spentDate: payload.spentDate || new Date().toISOString().slice(0, 10),
        referenceCode: payload.referenceCode || '',
        approvedByName: session.fullName,
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: new Date().toISOString(),
      };
      db.expenditureRecords.unshift(exp);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'RECORD_EXPENDITURE',
        module: 'transparency',
        targetId: exp.id,
        summary: `Recorded expenditure of KES ${exp.amountKes} for ${exp.category}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, expenditure: exp });
    }

    if (action === 'delete_expenditure') {
      const session = assertAuthorizedAdmin(token, 'transparency');
      const db = readDatabase();
      const target = db.expenditureRecords.find((e) => e.id === payload.id);
      db.expenditureRecords = db.expenditureRecords.filter((e) => e.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_EXPENDITURE',
        module: 'transparency',
        targetId: payload.id,
        summary: `Deleted expenditure record of KES ${target?.amountKes || ''} for ${target?.category || payload.id}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'save_transparency_report') {
      const session = assertAuthorizedAdmin(token, 'transparency');
      const db = readDatabase();
      const report = {
        id: createUuid(),
        title: String(payload.title).trim(),
        reportingPeriod: String(payload.reportingPeriod).trim(),
        summary: String(payload.summary).trim(),
        totalConfirmedFundsKes: Number(payload.totalConfirmedFundsKes || 0),
        totalExpenditureKes: Number(payload.totalExpenditureKes || 0),
        remainingBalanceKes: Number(payload.remainingBalanceKes || 0),
        publicationStatus: payload.publicationStatus || 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      db.transparencyReports.unshift(report);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'PUBLISH_TRANSPARENCY_REPORT',
        module: 'transparency',
        targetId: report.id,
        summary: `Published financial transparency report "${report.title}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, report });
    }

    // 9. MERCHANDISE & COMMUNITY MODULES
    if (action === 'save_product') {
      const session = assertAuthorizedAdmin(token, 'merchandise');
      const db = readDatabase();
      const product = {
        id: createUuid(),
        name: String(payload.name).trim(),
        slug: slugify(payload.name),
        category: payload.category || 'Jerseys',
        description: String(payload.description).trim(),
        priceKes: Number(payload.priceKes),
        imageUrl: payload.imageUrl || '',
        availableSizes: Array.isArray(payload.availableSizes)
          ? payload.availableSizes
          : ['S', 'M', 'L', 'XL'],
        stockStatus: payload.stockStatus || 'in_stock',
        whatsappOrderEnabled: true,
        publicationStatus: payload.publicationStatus || 'published',
        createdAt: new Date().toISOString(),
      };
      db.products.unshift(product);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CREATE_PRODUCT',
        module: 'merchandise',
        targetId: product.id,
        summary: `Added merchandise product "${product.name}" (KES ${product.priceKes})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, product });
    }

    if (action === 'delete_product') {
      const session = assertAuthorizedAdmin(token, 'merchandise');
      const db = readDatabase();
      const target = db.products.find((p) => p.id === payload.id);
      db.products = db.products.filter((p) => p.id !== payload.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_PRODUCT',
        module: 'merchandise',
        targetId: payload.id,
        summary: `Deleted merchandise product "${target?.name || payload.id}"`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'update_recruitment_status') {
      const session = assertAuthorizedAdmin(token, 'recruitment');
      const db = readDatabase();
      const app = db.recruitmentApplications.find((r) => r.id === payload.id);
      if (!app) {
        return NextResponse.json({ ok: false, error: 'Application not found.' }, { status: 404 });
      }
      if (payload.applicationStatus) app.applicationStatus = payload.applicationStatus;
      if (payload.reviewerNotes !== undefined) app.reviewerNotes = payload.reviewerNotes;
      app.updatedAt = new Date().toISOString();

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPDATE_RECRUITMENT_APPLICATION',
        module: 'recruitment',
        targetId: app.id,
        summary: `Updated trial application for ${app.fullName} to ${app.applicationStatus}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, application: app });
    }

    // 10. HOMEPAGE, CLUB INFO & BRAND SETTINGS EDITOR
    if (action === 'save_club_settings') {
      const session = assertAuthorizedAdmin(token, 'homepage');
      const db = readDatabase();
      db.clubSettings = {
        ...db.clubSettings,
        ...payload,
        clubInfo: {
          ...db.clubSettings.clubInfo,
          ...(payload.clubInfo || {}),
        },
        seoMetadata: {
          ...db.clubSettings.seoMetadata,
          ...(payload.seoMetadata || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPDATE_CLUB_BRAND_SETTINGS',
        module: 'settings',
        summary: `Updated club branding, hero slides, or club information settings`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, clubSettings: db.clubSettings });
    }

    if (action === 'save_website_section') {
      const session = assertAuthorizedAdmin(token, 'homepage');
      const db = readDatabase();
      const sec = db.websiteSections.find(
        (s) => s.id === payload.id || s.sectionKey === payload.sectionKey
      );
      if (!sec) {
        return NextResponse.json({ ok: false, error: 'Section not found.' }, { status: 404 });
      }
      Object.assign(sec, payload, { updatedAt: new Date().toISOString() });
      db.websiteSections.sort((a, b) => a.displayOrder - b.displayOrder);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPDATE_HOMEPAGE_SECTION',
        module: 'homepage',
        targetId: sec.sectionKey,
        summary: `Updated homepage section "${sec.title}" (Visible: ${sec.isVisible})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true, section: sec });
    }

    // 11. ADMINISTRATIVE USERS & ROLES (Strict Super Admin Only + Owner Protection)
    if (action === 'create_admin_user') {
      const session = assertAuthorizedAdmin(token, 'users');
      if (session.roleCode !== 'SUPER_ADMIN') {
        throw new Error('FORBIDDEN: Only the Super Administrator can manage administrative users.');
      }
      const db = readDatabase();
      const email = String(payload.email || '').trim().toLowerCase();
      if (db.users.some((u) => u.email.toLowerCase() === email)) {
        return NextResponse.json(
          { ok: false, error: 'An administrator with that email already exists.' },
          { status: 400 }
        );
      }
      const now = new Date().toISOString();
      const newUser = {
        id: createUuid(),
        email,
        fullName: String(payload.fullName).trim(),
        passwordHash: bcrypt.hashSync(String(payload.password || 'WarriorsAdmin2026!'), 10),
        roleCode: (payload.roleCode || 'CONTENT_EDITOR') as AdminRoleCode,
        isOwnerSuperAdmin: false,
        isActive: true,
        mfaEnabled: false,
        createdAt: now,
        updatedAt: now,
      };
      db.users.push(newUser);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'CREATE_ADMIN_USER',
        module: 'users',
        targetId: newUser.id,
        summary: `Created administrator ${newUser.email} with role ${newUser.roleCode}`,
      });
      await saveDatabaseAndSync(db);
      const { passwordHash: _pw, ...safeUser } = newUser;
      return NextResponse.json({ ok: true, user: safeUser });
    }

    if (action === 'delete_admin_user') {
      const session = assertAuthorizedAdmin(token, 'users');
      if (session.roleCode !== 'SUPER_ADMIN') {
        throw new Error('FORBIDDEN: Only the Super Administrator can remove users.');
      }
      const db = readDatabase();
      const target = db.users.find((u) => u.id === payload.userId);
      if (!target) {
        return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 404 });
      }
      if (target.isOwnerSuperAdmin) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'SECURITY PROTECTION: The primary Owner Super Administrator account is protected and cannot be deleted.',
          },
          { status: 403 }
        );
      }
      db.users = db.users.filter((u) => u.id !== target.id);
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'DELETE_ADMIN_USER',
        module: 'users',
        targetId: target.id,
        summary: `Removed administrator ${target.email}`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'mark_notifications_read') {
      const session = assertAuthorizedAdmin(token, 'notifications');
      const db = readDatabase();
      db.notifications.forEach((n) => {
        n.isRead = true;
      });
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'MARK_NOTIFICATIONS_READ',
        module: 'notifications',
        summary: 'Marked all administrative notifications as read',
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    if (action === 'save_integration_setting') {
      const session = assertAuthorizedAdmin(token, 'integrations');
      if (session.roleCode !== 'SUPER_ADMIN') {
        throw new Error('FORBIDDEN: Only Super Admin can modify integration settings.');
      }
      const db = readDatabase();
      const item = db.integrationSettings.find((i) => i.providerKey === payload.providerKey);
      if (item) {
        item.isEnabled = Boolean(payload.isEnabled);
        item.environment = payload.environment || item.environment;
        item.publicConfig = { ...item.publicConfig, ...(payload.publicConfig || {}) };
        item.updatedAt = new Date().toISOString();
      }
      recordAuditLog(db, {
        actorUserId: session.userId,
        actorName: session.fullName,
        actorRole: session.roleCode,
        action: 'UPDATE_INTEGRATION',
        module: 'integrations',
        targetId: payload.providerKey,
        summary: `Updated integration ${payload.providerKey} (Enabled: ${payload.isEnabled})`,
      });
      await saveDatabaseAndSync(db);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server operation failed';
    const status = message.startsWith('UNAUTHORIZED')
      ? 401
      : message.startsWith('FORBIDDEN')
      ? 403
      : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
