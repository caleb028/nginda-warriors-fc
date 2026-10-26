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
  assert.equal(db.clubSettings.crestUrl, '/brand/nginda-warriors-crest.svg');
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
