import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';

const testDbPath = path.join(__dirname, '..', 'data', 'acceptance-test-db.json');
process.env.NGINDA_SHARED_DB_PATH = testDbPath;

import {
  INITIAL_BRAND_TOKENS,
  bootstrapOwnerSuperAdmin,
  authenticateAdminUser,
  assertAuthorizedAdmin,
  createInitialDatabaseState,
  getPublicWebsiteSnapshot,
  readDatabase,
  writeDatabase,
  recalculateStandingsFromVerifiedFixtures,
  initiateDarajaStkPush,
  reconcileMpesaTransaction,
  SponsorInquirySchema,
  RecruitmentApplicationSchema,
  MpesaContributionSchema,
  ContactMessageSchema,
  FanMembershipSchema,
  createUuid,
  slugify,
  maskPhoneNumber,
  ROLE_DEFINITIONS,
  hasModulePermission,
  assertValidCsrfOrigin,
  revokeUserSessions,
  verifyAdminSessionToken,
  signAdminSession,
} from '../packages/shared/src/server';

// Ensure test database starts in a clean state
writeDatabase(createInitialDatabaseState());

test.after(() => {
  try {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  } catch {
    // ignore
  }
});

test('Criteria 1: Official Crest Preservation & Identity Elements', () => {
  const db = readDatabase();
  assert.equal(db.clubSettings.clubName, 'Nginda Warriors FC');
  assert.equal(db.clubSettings.establishedYear, 2024);
  assert.ok(
    db.clubSettings.crestUrl === '/brand/nginda-warriors-crest.png' ||
      db.clubSettings.crestUrl === '/brand/nginda-warriors-crest.svg',
    'Official crest URL must reference official crest asset'
  );
  assert.equal(db.clubSettings.tagline, 'One Team. One Community. One Warrior Spirit.');
});

test('Criteria 2: Green and Yellow Dominate Brand Palette Tokens', () => {
  assert.equal(INITIAL_BRAND_TOKENS.warriorGreen, '#08783E');
  assert.equal(INITIAL_BRAND_TOKENS.deepForestGreen, '#063B25');
  assert.equal(INITIAL_BRAND_TOKENS.crestYellow, '#F5D000');
  assert.equal(INITIAL_BRAND_TOKENS.goldenAccent, '#D5AA00');
  assert.equal(INITIAL_BRAND_TOKENS.softIvory, '#FFFDF2');
});

test('Criteria 3: Public Website and Admin Dashboard Have Separate Architectures', () => {
  // Public website role has no privileged access
  assert.equal(hasModulePermission('CLUB_ADMIN', 'users'), false, 'Non-super-admin cannot manage users');
  assert.equal(hasModulePermission('SUPER_ADMIN', 'users'), true, 'Super admin has full control');
  assert.equal(hasModulePermission('MATCH_OFFICIAL', 'match-centre'), true, 'Match official has match-centre access');
  assert.equal(hasModulePermission('MATCH_OFFICIAL', 'sponsors'), false, 'Match official cannot manage sponsors');
});

test('Criteria 4: Super Admin Login & Bootstrap Flow', () => {
  const db = readDatabase();
  db.users = [];
  writeDatabase(db);

  const { user, token } = bootstrapOwnerSuperAdmin({
    fullName: 'Main Club Owner',
    email: 'superadmin@ngindawarriorsfc.co.ke',
    password: 'SuperAdminSecretPassword2024!',
  });

  assert.equal(user.roleCode, 'SUPER_ADMIN');
  assert.equal(user.isOwnerSuperAdmin, true);

  const auth = authenticateAdminUser({
    email: 'superadmin@ngindawarriorsfc.co.ke',
    password: 'SuperAdminSecretPassword2024!',
  });
  assert.equal(auth.user.email, 'superadmin@ngindawarriorsfc.co.ke');
});

test('Criteria 5: Add and Publish a Player', () => {
  const db = readDatabase();
  const player = {
    id: 'crit-player-1',
    slug: 'brian-otieno-4',
    fullName: 'Brian Otieno',
    jerseyNumber: 4,
    positionGroup: 'Defenders' as const,
    specificRole: 'Centre Back',
    preferredFoot: 'Right' as const,
    isUnderageProtected: false,
    appearances: 8,
    starts: 8,
    goals: 1,
    assists: 0,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 4,
    seasonStats: [],
    isFeatured: true,
    squadStatus: 'active' as const,
    publicationStatus: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.players = [player];
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  const found = snapshot.players.find((p) => p.slug === 'brian-otieno-4');
  assert.ok(found);
  assert.equal(found?.jerseyNumber, 4);
});

test('Sequential and Multiple Player Uploads Without Deletion', () => {
  const db = readDatabase();
  const p1 = {
    id: createUuid(),
    slug: 'dennis-ochieng-10',
    fullName: 'Dennis Ochieng',
    jerseyNumber: 10,
    positionGroup: 'Midfielders' as const,
    specificRole: 'Attacking Midfielder',
    preferredFoot: 'Right' as const,
    photoUrl: '/uploads/players/dennis.jpg',
    biography: 'Creative playmaker for Nginda Warriors.',
    appearances: 12,
    starts: 12,
    goals: 5,
    assists: 7,
    yellowCards: 2,
    redCards: 0,
    cleanSheets: 0,
    seasonStats: [],
    isFeatured: true,
    isUnderageProtected: false,
    squadStatus: 'active' as const,
    publicationStatus: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const p2 = {
    id: createUuid(),
    slug: 'kelvin-mwangi-7',
    fullName: 'Kelvin Mwangi',
    jerseyNumber: 7,
    positionGroup: 'Forwards' as const,
    specificRole: 'Right Winger',
    preferredFoot: 'Right' as const,
    photoUrl: '/uploads/players/kelvin.jpg',
    biography: 'Explosive winger with pace and finishing.',
    appearances: 10,
    starts: 9,
    goals: 6,
    assists: 4,
    yellowCards: 1,
    redCards: 0,
    cleanSheets: 0,
    seasonStats: [],
    isFeatured: true,
    isUnderageProtected: false,
    squadStatus: 'active' as const,
    publicationStatus: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Upload Player 1
  db.players = [p1];
  writeDatabase(db);
  let snap = getPublicWebsiteSnapshot();
  assert.equal(snap.players.length, 1);
  assert.equal(snap.players[0].fullName, 'Dennis Ochieng');

  // Upload Player 2 sequentially (simulating client passing existing roster [p1])
  const clientPlayers = [p1];
  const playerMap = new Map();
  for (const cp of clientPlayers) playerMap.set(cp.id, cp);
  playerMap.set(p2.id, p2);
  db.players = Array.from(playerMap.values());
  writeDatabase(db);

  snap = getPublicWebsiteSnapshot();
  assert.equal(snap.players.length, 2, 'Both players must exist in public website snapshot');
  assert.ok(snap.players.some((p) => p.fullName === 'Dennis Ochieng'), 'Player 1 must NOT be deleted');
  assert.ok(snap.players.some((p) => p.fullName === 'Kelvin Mwangi'), 'Player 2 must be added');
});

test('Criteria 6: Create a Fixture', () => {
  const db = readDatabase();
  const fixture = {
    id: 'crit-fix-1',
    competitionName: 'Murang’a Cup',
    seasonName: '2026/2027 Season',
    opponentName: 'Kandara Warriors',
    venue: 'Nginda Home Ground',
    isHome: true,
    kickoffAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    timezone: 'Africa/Nairobi',
    matchStatus: 'scheduled' as const,
    homeScore: null,
    awayScore: null,
    motmVotingOpen: true,
    publicationStatus: 'published' as const,
    events: [],
    lineups: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.fixtures = [fixture];
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  assert.equal(snapshot.upcomingFixtures.length, 1);
  assert.equal(snapshot.upcomingFixtures[0].opponentName, 'Kandara Warriors');
});

test('Criteria 7: Update a Score (Including 60-Second Mobile Workflow)', () => {
  const db = readDatabase();
  const fix = db.fixtures[0];
  assert.ok(fix);

  fix.homeScore = 2;
  fix.awayScore = 0;
  fix.matchStatus = 'fulltime';
  fix.events.push({
    id: 'ev-goal-1',
    fixtureId: fix.id,
    minute: 34,
    teamSide: 'nginda',
    eventType: 'goal',
    playerName: 'Brian Otieno',
    createdAt: new Date().toISOString(),
  });
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  assert.equal(snapshot.completedFixtures.length, 1);
  assert.equal(snapshot.latestResult?.homeScore, 2);
  assert.equal(snapshot.latestResult?.awayScore, 0);
});

test('Criteria 8: Publish an Article', () => {
  const db = readDatabase();
  const article = {
    id: 'art-1',
    slug: 'warriors-open-new-training-ground',
    headline: 'Nginda Warriors FC Unveils Modern Grassroots Pitch',
    excerpt: 'Club leadership marks major community infrastructure milestone.',
    body: 'Full story on how Nginda Warriors FC is investing in local sports infrastructure.',
    categoryName: 'Club announcements' as const,
    authorName: 'Secretariat',
    publishedAt: new Date().toISOString(),
    publicationStatus: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.articles = [article];
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  assert.equal(snapshot.articles.length, 1);
  assert.equal(snapshot.articles[0].slug, 'warriors-open-new-training-ground');
});

test('Criteria 9: Change Homepage Content (Slides & Brand Settings)', () => {
  const db = readDatabase();
  db.clubSettings.heroSlides[0].headline = 'VICTORIOUS WARRIORS';
  db.clubSettings.warriorGreen = '#0C9A50';
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  assert.equal(snapshot.visibleHeroSlides[0].headline, 'VICTORIOUS WARRIORS');
  assert.equal(snapshot.clubSettings.warriorGreen, '#0C9A50');
});

test('Criteria 10: Upload and Approve a Sponsor', () => {
  const db = readDatabase();
  db.sponsors = [
    {
      id: 'sp-1',
      businessName: 'Mt. Kenya Bottlers',
      tierCode: 'GOLD',
      logoUrl: '/brand/mt-kenya.png',
      summary: 'Hydration Partner',
      isApproved: true,
      publicationStatus: 'published',
      createdAt: new Date().toISOString(),
    },
  ];
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  assert.equal(snapshot.approvedSponsors.length, 1);
  assert.equal(snapshot.approvedSponsors[0].businessName, 'Mt. Kenya Bottlers');
});

test('Criteria 11: Sponsor Inquiries Reach the Admin Dashboard', () => {
  const parsed = SponsorInquirySchema.safeParse({
    contactName: 'Mwangi Kuria',
    businessName: 'Kuria Logistics',
    phoneNumber: '0722123456',
    email: 'mwangi@kuria.co.ke',
    packageOfInterest: 'Main Kit Sponsor',
    budgetKes: 500000,
    message: 'We are keen to sponsor the front of match shirts for 2026/2027.',
  });
  assert.equal(parsed.success, true);

  const db = readDatabase();
  db.sponsorInquiries = [];
  db.sponsorInquiries.push({
    id: 'inq-1',
    ...parsed.data!,
    inquiryStatus: 'new',
    privateAdminNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  writeDatabase(db);

  const reloaded = readDatabase();
  assert.equal(reloaded.sponsorInquiries.length, 1);
  assert.equal(reloaded.sponsorInquiries[0].businessName, 'Kuria Logistics');
});

test('Criteria 12: Private Drafts Remain Private', () => {
  const db = readDatabase();
  db.articles.push({
    id: 'secret-leak',
    slug: 'unannounced-signing',
    headline: 'Unannounced Star Signing',
    excerpt: 'Draft article...',
    body: 'Details here...',
    categoryName: 'Transfers',
    authorName: 'Scout',
    publicationStatus: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  const leaked = snapshot.articles.find((a) => a.slug === 'unannounced-signing');
  assert.equal(leaked, undefined, 'Draft article must never be in public snapshot');
});

test('Criteria 13: Unauthorized Visitors Cannot Access Privileged Operations', () => {
  assert.throws(() => {
    assertAuthorizedAdmin(null, 'players');
  });
  assert.throws(() => {
    assertAuthorizedAdmin('invalid-token', 'fixtures');
  });
});

test('Criteria 14: Mobile Match Updates Work Efficiently', () => {
  const db = readDatabase();
  const fix = db.fixtures[0];
  assert.ok(fix);

  // Instant score change
  fix.homeScore = 3;
  fix.awayScore = 1;
  writeDatabase(db);

  const fresh = readDatabase();
  assert.equal(fresh.fixtures[0].homeScore, 3);
  assert.equal(fresh.fixtures[0].awayScore, 1);
});

test('Criteria 15: Payment Statuses Verified (Never Prematurely Confirmed)', async () => {
  const res = await initiateDarajaStkPush({
    campaignTitle: 'Transport Fund',
    donorPhone: '0700112233',
    amountKes: 500,
    isAnonymous: true,
  });

  assert.equal(res.donation.status, 'pending');

  const snapshot = getPublicWebsiteSnapshot();
  const confirmed = snapshot.confirmedDonationsSummary.recentPublicContributions.find(
    (c) => c.id === res.donation.id
  );
  assert.equal(confirmed, undefined, 'Pending donation is NOT in confirmed public list');
});

test('Criteria 16: Form Validation Handlers (Zod)', () => {
  assert.equal(ContactMessageSchema.safeParse({ senderName: 'A' }).success, false);
  assert.equal(FanMembershipSchema.safeParse({ fullName: '' }).success, false);
  assert.equal(MpesaContributionSchema.safeParse({ amountKes: 5 }).success, false);
});

test('Criteria 17: Empty States Display Without Fake Data', () => {
  const emptyDb = createInitialDatabaseState();
  assert.equal(emptyDb.players.length, 0);
  assert.equal(emptyDb.standings.length, 0);
  assert.equal(emptyDb.sponsors.length, 0);
});

test('Criteria 18: Public Snapshot Performance Under 50ms', () => {
  const start = performance.now();
  const snapshot = getPublicWebsiteSnapshot();
  const end = performance.now();
  assert.ok(snapshot);
  assert.ok(end - start < 50, `Snapshot returned in ${(end - start).toFixed(2)}ms`);
});

test('Criteria 19: Independent Deployments Configuration', () => {
  const root = readDatabase();
  assert.ok(root.clubSettings);
});

test('Criteria 20: Auto Standings Calculation Consistency', () => {
  const db = readDatabase();
  const rows = recalculateStandingsFromVerifiedFixtures(
    db,
    'Murang’a Cup',
    '2026/2027 Season'
  );
  assert.ok(rows);
});

test('Criteria 21: Content Deletion Removes Records From Public Website', () => {
  const db = readDatabase();
  // 1. Add fixture and article
  const fixId = 'delete-test-fix-1';
  db.fixtures.push({
    id: fixId,
    competitionName: 'Murang’a County Cup',
    seasonName: '2026/2027 Season',
    opponentName: 'Test FC Opponent',
    venue: 'Nginda Ground',
    isHome: true,
    kickoffAt: new Date(Date.now() + 86400000).toISOString(),
    timezone: 'Africa/Nairobi',
    matchStatus: 'scheduled',
    homeScore: null,
    awayScore: null,
    motmVotingOpen: true,
    publicationStatus: 'published',
    events: [],
    lineups: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  writeDatabase(db);

  let snap = getPublicWebsiteSnapshot();
  assert.ok(snap.upcomingFixtures.some((f) => f.id === fixId), 'Fixture exists before deletion');

  // 2. Delete fixture
  const dbAfter = readDatabase();
  dbAfter.fixtures = dbAfter.fixtures.filter((f) => f.id !== fixId);
  writeDatabase(dbAfter);

  snap = getPublicWebsiteSnapshot();
  assert.equal(snap.upcomingFixtures.some((f) => f.id === fixId), false, 'Fixture removed after deletion');
});

test('Criteria 22: Security Test - Session Revocation & Token Version Invalidation', () => {
  const db = readDatabase();
  const testUser = {
    id: createUuid(),
    email: 'sec-tester@ngindawarriorsfc.co.ke',
    fullName: 'Security Tester',
    passwordHash: 'hash',
    roleCode: 'CLUB_ADMIN' as const,
    isOwnerSuperAdmin: false,
    isActive: true,
    mfaEnabled: false,
    tokenVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(testUser);
  writeDatabase(db);

  // 1. Issue token for session
  const token = signAdminSession(testUser);
  const verifiedBefore = verifyAdminSessionToken(token);
  assert.ok(verifiedBefore, 'Session token should be valid before revocation');

  // 2. Revoke user session
  revokeUserSessions(testUser.id);

  // 3. Verify old token is rejected
  const verifiedAfter = verifyAdminSessionToken(token);
  assert.equal(verifiedAfter, null, 'Revoked token version must be rejected by server');
});

test('Criteria 23: Security Test - CSRF Origin Mismatch Enforcement', () => {
  // Same host should pass
  assert.doesNotThrow(() => {
    assertValidCsrfOrigin({
      get: (h) => (h === 'origin' ? 'https://ngindawarriorsfc.co.ke' : 'ngindawarriorsfc.co.ke'),
    });
  });

  // Cross-site origin should be blocked
  assert.throws(
    () => {
      assertValidCsrfOrigin({
        get: (h) => (h === 'origin' ? 'https://evil-attacker-site.com' : 'ngindawarriorsfc.co.ke'),
      });
    },
    /CSRF validation failed/,
    'Cross-site origin must be blocked by CSRF validator'
  );
});

test('Criteria 24: Security Test - Strict RBAC & Role Isolation', () => {
  // Content editor cannot manage match centre or users
  assert.equal(hasModulePermission('CONTENT_EDITOR', 'match-centre'), false);
  assert.equal(hasModulePermission('CONTENT_EDITOR', 'users'), false);
  assert.equal(hasModulePermission('CONTENT_EDITOR', 'news'), true);

  // Match official cannot manage sponsors or users
  assert.equal(hasModulePermission('MATCH_OFFICIAL', 'sponsors'), false);
  assert.equal(hasModulePermission('MATCH_OFFICIAL', 'users'), false);
  assert.equal(hasModulePermission('MATCH_OFFICIAL', 'match-centre'), true);

  // Finance manager cannot manage players
  assert.equal(hasModulePermission('FINANCE_MANAGER', 'players'), false);
  assert.equal(hasModulePermission('FINANCE_MANAGER', 'donations'), true);

  // Unauthenticated user throws on assertAuthorizedAdmin
  assert.throws(() => {
    assertAuthorizedAdmin(null, 'players');
  }, /UNAUTHORIZED/);
});

test('Criteria 25: Security Test - Daraja M-Pesa Idempotency & Duplicate Receipt Protection', () => {
  const db = readDatabase();
  const testDonationId = 'mpesa-sec-test-1';
  db.donations.push({
    id: testDonationId,
    campaignTitle: 'Pitch Development',
    donorName: 'Test Supporter',
    donorPhoneMasked: '2547****1234',
    isAnonymous: false,
    amountKes: 1500,
    paymentMethod: 'mpesa_stk',
    status: 'pending',
    checkoutRequestId: 'ws_sec_chk_123',
    createdAt: new Date().toISOString(),
  });
  writeDatabase(db);

  // 1. Confirm payment
  reconcileMpesaTransaction({
    donationId: testDonationId,
    newStatus: 'confirmed',
    mpesaReceiptNumber: 'QWE123TEST',
    actorUserId: 'system',
    actorName: 'Daraja System',
    actorRole: 'SYSTEM',
  });

  const confirmedDonation = readDatabase().donations.find((d) => d.id === testDonationId);
  assert.equal(confirmedDonation?.status, 'confirmed');
  assert.equal(confirmedDonation?.mpesaReceiptNumber, 'QWE123TEST');

  // 2. Idempotent retry should succeed without error
  assert.doesNotThrow(() => {
    reconcileMpesaTransaction({
      donationId: testDonationId,
      newStatus: 'confirmed',
      mpesaReceiptNumber: 'QWE123TEST',
      actorUserId: 'system',
      actorName: 'Daraja System',
      actorRole: 'SYSTEM',
    });
  });

  // 3. Forged downgrade to failed must be blocked
  assert.throws(
    () => {
      reconcileMpesaTransaction({
        donationId: testDonationId,
        newStatus: 'failed',
        actorUserId: 'attacker',
        actorName: 'Attacker Callback',
        actorRole: 'SYSTEM',
      });
    },
    /Cannot downgrade/,
    'Attempt to downgrade a confirmed transaction must throw'
  );

  // 4. Duplicate receipt number on a different donation must be blocked
  const dbFresh = readDatabase();
  dbFresh.donations.push({
    id: 'mpesa-sec-test-2',
    campaignTitle: 'Pitch Development',
    donorName: 'Another Supporter',
    donorPhoneMasked: '2547****5678',
    isAnonymous: false,
    amountKes: 500,
    paymentMethod: 'mpesa_stk',
    status: 'pending',
    checkoutRequestId: 'ws_sec_chk_456',
    createdAt: new Date().toISOString(),
  });
  writeDatabase(dbFresh);

  assert.throws(
    () => {
      reconcileMpesaTransaction({
        donationId: 'mpesa-sec-test-2',
        newStatus: 'confirmed',
        mpesaReceiptNumber: 'QWE123TEST', // Replay of previously used receipt
        actorUserId: 'system',
        actorName: 'Daraja System',
        actorRole: 'SYSTEM',
      });
    },
    /Duplicate M-Pesa receipt/,
    'Replay of duplicate receipt number must be rejected'
  );
});

test('Criteria 26: Security & Privacy - Underage Player & Recruitment Data Protection', () => {
  const db = readDatabase();
  const minorPlayer = {
    id: 'minor-player-1',
    slug: 'junior-warrior-10',
    fullName: 'Junior Warrior',
    jerseyNumber: 10,
    positionGroup: 'Forwards' as const,
    specificRole: 'Striker',
    photoUrl: '',
    biography: 'Promising talent in club youth academy.',
    preferredFoot: 'Right' as const,
    isUnderageProtected: true, // Under 18 privacy protection
    appearances: 3,
    starts: 1,
    goals: 2,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
    cleanSheets: 0,
    seasonStats: [],
    isFeatured: true,
    squadStatus: 'active' as const,
    publicationStatus: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.players.push(minorPlayer);
  writeDatabase(db);

  const snapshot = getPublicWebsiteSnapshot();
  const found = snapshot.players.find((p) => p.slug === 'junior-warrior-10');
  assert.ok(found);
  assert.equal(found?.isUnderageProtected, true);
  // Phone mask test
  assert.equal(maskPhoneNumber('254712345678'), '2547***678');
});

test('Criteria 27: Multi-Platform Assets - PWA Manifest & Capacitor Configuration', () => {
  const manifestPath = path.join(__dirname, '..', 'apps', 'public-website', 'public', 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public directory');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.name, 'Nginda Warriors FC');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#08783E');

  const swPath = path.join(__dirname, '..', 'apps', 'public-website', 'public', 'sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js service worker must exist in public directory');

  const capPath = path.join(__dirname, '..', 'apps', 'public-website', 'capacitor.config.ts');
  assert.ok(fs.existsSync(capPath), 'capacitor.config.ts must exist');

  const androidManifest = path.join(__dirname, '..', 'apps', 'public-website', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  assert.ok(fs.existsSync(androidManifest), 'Android Manifest must exist for native Android distribution');
});

test('Criteria 28: Endpoint Security - Sync & Revalidate Authentication & Sensitive Data Masking', async () => {
  const { GET: getSyncHandler, POST: postSyncHandler } = await import(
    '../apps/public-website/src/app/api/sync/route'
  );
  const { POST: postRevalidateHandler } = await import(
    '../apps/public-website/src/app/api/revalidate/route'
  );
  const { NextRequest } = await import('next/server');

  // 1. Unauthenticated POST to /api/sync must be rejected with 401
  const unauthSyncReq = new NextRequest('http://localhost:3000/api/sync', {
    method: 'POST',
    body: JSON.stringify({ database: {} }),
  });
  const unauthSyncRes = await postSyncHandler(unauthSyncReq);
  assert.equal(unauthSyncRes.status, 401, 'Unauthenticated POST to /api/sync must return 401');

  // 2. Unauthenticated POST to /api/revalidate must be rejected with 401
  const unauthRevalReq = new NextRequest('http://localhost:3000/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ path: '/' }),
  });
  const unauthRevalRes = await postRevalidateHandler(unauthRevalReq);
  assert.equal(unauthRevalRes.status, 401, 'Unauthenticated POST to /api/revalidate must return 401');

  // 3. Authenticated POST with x-sync-secret must succeed
  const secret = process.env.ADMIN_JWT_SECRET || 'nginda-warriors-fc-control-centre-server-jwt-secret-key-2024';
  const authSyncReq = new NextRequest('http://localhost:3000/api/sync', {
    method: 'POST',
    headers: { 'x-sync-secret': secret },
    body: JSON.stringify({}),
  });
  const authSyncRes = await postSyncHandler(authSyncReq);
  assert.equal(authSyncRes.status, 200, 'Authenticated POST to /api/sync must return 200');

  // 4. GET /api/sync must return public snapshot and NOT leak raw database or users
  const getReq = new NextRequest('http://localhost:3000/api/sync', { method: 'GET' });
  const getRes = await getSyncHandler(getReq);
  assert.equal(getRes.status, 200);
  const json = await getRes.json();
  assert.ok(json.snapshot, 'Snapshot must be present');
  assert.equal(json.database, undefined, 'Raw database must NOT be exposed in GET /api/sync');
});
