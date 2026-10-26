import fs from 'fs';
import path from 'path';
import { createUuid, maskPhoneNumber, slugify } from './utils';

import {
  AdminNotification,
  AdminRoleCode,
  AdminUser,
  Article,
  AuditLogEntry,
  ClubEvent,
  ClubSettings,
  Competition,
  ContactMessage,
  DonationRecord,
  ExpenditureRecord,
  FanMembership,
  FanVoteRecord,
  Fixture,
  FundraisingCampaign,
  GalleryAlbum,
  INITIAL_BRAND_TOKENS,
  IntegrationSetting,
  MediaAsset,
  MerchandiseOrder,
  MerchandiseProduct,
  NgindaDatabaseSchema,
  Player,
  RecruitmentApplication,
  Season,
  Sponsor,
  SponsorAgreement,
  SponsorInquiry,
  SponsorshipPackage,
  StaffMember,
  StandingRow,
  TransparencyReport,
  WebsiteSection,
  hasModulePermission,
} from './types';

export type { NgindaDatabaseSchema };

export { createUuid, slugify, maskPhoneNumber };


function resolveMonorepoRoot(): string {
  if (process.env.NGINDA_SHARED_DB_PATH) {
    return path.dirname(process.env.NGINDA_SHARED_DB_PATH);
  }
  let current = process.cwd();
  for (let i = 0; i < 5; i++) {
    const pkgPath = path.join(current, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name === 'nginda-warriors-fc-platform') {
          return current;
        }
      } catch {
        // continue walking up
      }
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

export function getSharedDatabaseFilePath(): string {
  if (process.env.NGINDA_SHARED_DB_PATH) {
    return process.env.NGINDA_SHARED_DB_PATH;
  }
  const rootDir = resolveMonorepoRoot();
  const dataDir = path.join(rootDir, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'nginda-warriors-db.json');
}

export function getSupabaseServerClient(): any | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project-ref')) {
    return null;
  }
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

export function createInitialDatabaseState(): NgindaDatabaseSchema {
  const now = new Date().toISOString();
  const defaultSeasonId = createUuid();

  return {
    users: [], // Zero hardcoded credentials; Super Admin claims ownership via /setup
    clubSettings: {
      id: createUuid(),
      clubName: 'Nginda Warriors FC',
      shortName: 'Nginda Warriors',
      establishedYear: 2024,
      tagline: 'One Team. One Community. One Warrior Spirit.',
      crestUrl: '/brand/nginda-warriors-crest.svg',
      warriorGreen: INITIAL_BRAND_TOKENS.warriorGreen,
      deepForestGreen: INITIAL_BRAND_TOKENS.deepForestGreen,
      crestYellow: INITIAL_BRAND_TOKENS.crestYellow,
      goldenAccent: INITIAL_BRAND_TOKENS.goldenAccent,
      softIvory: INITIAL_BRAND_TOKENS.softIvory,
      lightGreenBg: INITIAL_BRAND_TOKENS.lightGreenBg,
      neutralGrey: INITIAL_BRAND_TOKENS.neutralGrey,
      charcoal: INITIAL_BRAND_TOKENS.charcoal,
      headingFont: INITIAL_BRAND_TOKENS.headingFont,
      bodyFont: INITIAL_BRAND_TOKENS.bodyFont,
      contactEmail: '',
      contactPhone: '',
      whatsappNumber: '',
      physicalAddress: 'Nginda, Murang’a County, Kenya',
      county: 'Murang’a County',
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
      },
      seoMetadata: {
        defaultTitle: 'Nginda Warriors FC | Official Football Club Website (Est. 2024)',
        titleTemplate: '%s | Nginda Warriors FC',
        defaultDescription:
          'Official digital home of Nginda Warriors FC (Est. 2024). One Team. One Community. One Warrior Spirit. Follow fixtures, results, squad profiles, news, and partnership opportunities.',
        keywords: [
          'Nginda Warriors FC',
          'Kenyan Football',
          'Muranga Football',
          'Grassroots Football Kenya',
          'Football Club Sponsorship Kenya',
        ],
        canonicalBaseUrl: 'https://ngindawarriorsfc.co.ke',
      },
      heroSlides: [
        {
          id: createUuid(),
          headline: 'NGINDA WARRIORS FC',
          tagline: 'One Team. One Community. One Warrior Spirit.',
          description:
            'Established in 2024 to unite our community through competitive football, discipline, youth empowerment, and sporting excellence.',
          imageUrl: '',
          primaryCtaLabel: 'Explore Our Club',
          primaryCtaHref: '/about',
          secondaryCtaLabel: 'Partner With Us',
          secondaryCtaHref: '/sponsors',
          isVisible: true,
          displayOrder: 1,
        },
      ],
      clubInfo: {
        aboutSummary:
          'Nginda Warriors FC is a community-rooted football club established in 2024, built on discipline, competitive ambition, and local pride.',
        historyNarrative:
          'Founded in 2024, Nginda Warriors FC was established to provide structured, competitive football opportunities for local talent while bringing together supporters, families, and businesses under the Warrior spirit. Additional historical milestones are published here as approved by club leadership.',
        visionStatement:
          'To become a model community football institution recognized for sporting excellence, youth talent development, and transparent governance.',
        missionStatement:
          'To nurture football talent, compete with honour and discipline in every fixture, and strengthen community bonds through sport.',
        coreValues: [
          {
            title: 'Discipline & Integrity',
            description: 'High standards of conduct on the pitch, in training, and in club governance.',
          },
          {
            title: 'Warrior Competitive Spirit',
            description: 'Relentless effort, teamwork, and tactical courage from kickoff to the final whistle.',
          },
          {
            title: 'Community Unity',
            description: 'Proudly representing Nginda and empowering youth through positive mentorship.',
          },
          {
            title: 'Financial & Operational Transparency',
            description: 'Accountable stewardship of every supporter contribution and sponsor partnership.',
          },
        ],
        honoursAndMilestones: [
          {
            year: '2024',
            title: 'Official Club Foundation',
            description: 'Nginda Warriors FC officially established under the green-and-yellow Warrior crest.',
          },
        ],
        homeGroundName: '',
        homeGroundAddress: 'Nginda',
        homeGroundDescription:
          'Official home ground details and matchday visitor guidance are managed and published by club administration.',
        trainingGroundName: '',
        trainingGroundSchedule: '',
        trainingGroundDescription:
          'Training session schedules and ground locations are updated by the technical bench through the Control Centre.',
        communityImpactSummary:
          'Nginda Warriors FC invests in grassroots football development, youth mentorship, and community cohesion through organized sport.',
        developmentObjectives: [
          'Provide structured coaching and safe training environments for emerging local footballers.',
          'Compete with distinction in regional and national football competitions.',
          'Build sustainable commercial partnerships with local and national businesses.',
          'Maintain transparent financial stewardship for all club development initiatives.',
        ],
      },
      updatedAt: now,
    },
    websiteSections: [
      {
        id: createUuid(),
        sectionKey: 'match_centre',
        title: 'MATCH CENTRE',
        subtitle: 'Upcoming Fixture, Latest Result & Standings Snapshot',
        description: 'Official match schedules, live scores updated by match officials, and verified results.',
        primaryCtaLabel: 'View All Fixtures',
        primaryCtaHref: '/fixtures',
        isVisible: true,
        displayOrder: 1,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        sectionKey: 'featured_squad',
        title: 'THE WARRIORS SQUAD',
        subtitle: 'First Team Profiles & Technical Bench',
        description: 'Meet the approved players and coaching staff representing Nginda Warriors FC.',
        primaryCtaLabel: 'Full Squad Directory',
        primaryCtaHref: '/team',
        isVisible: true,
        displayOrder: 2,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        sectionKey: 'latest_news',
        title: 'CLUB NEWS & UPDATES',
        subtitle: 'Official Announcements, Match Reports & Community Stories',
        description: 'Stay informed with verified updates straight from Nginda Warriors FC.',
        primaryCtaLabel: 'Read All News',
        primaryCtaHref: '/news',
        isVisible: true,
        displayOrder: 3,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        sectionKey: 'community_impact',
        title: 'COMMUNITY IMPACT',
        subtitle: 'Building Talent & Opportunity Through Football',
        description: 'Discover how Nginda Warriors FC empowers youth and unites our community.',
        primaryCtaLabel: 'Support the Club',
        primaryCtaHref: '/support',
        isVisible: true,
        displayOrder: 4,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        sectionKey: 'sponsors_strip',
        title: 'OFFICIAL PARTNERS & SPONSORS',
        subtitle: 'Businesses Standing With The Warriors',
        description: 'Partner with Nginda Warriors FC and grow alongside our vibrant football community.',
        primaryCtaLabel: 'Partner With Us',
        primaryCtaHref: '/sponsors',
        isVisible: true,
        displayOrder: 5,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        sectionKey: 'final_cta',
        title: 'STAND WITH THE WARRIORS.',
        subtitle: 'One Team. One Community. One Warrior Spirit.',
        description: 'Support local football, empower talent, and help build the future of Nginda Warriors FC.',
        primaryCtaLabel: 'Support the Club',
        primaryCtaHref: '/support',
        secondaryCtaLabel: 'Become a Sponsor',
        secondaryCtaHref: '/sponsors',
        isVisible: true,
        displayOrder: 6,
        publicationStatus: 'published',
        updatedAt: now,
      },
    ],
    seasons: [
      {
        id: defaultSeasonId,
        name: '2026/2027 Season',
        startDate: '2026-08-01',
        endDate: '2027-05-31',
        isCurrent: true,
      },
    ],
    competitions: [],
    players: [],
    staff: [],
    fixtures: [],
    standings: [],
    articles: [],
    galleryAlbums: [],
    mediaAssets: [],
    events: [],
    sponsorshipPackages: [
      {
        id: createUuid(),
        tierCode: 'BRONZE',
        name: 'Bronze Community Partner',
        priceKes: null, // Admin configures approved KES figure
        billingPeriod: 'Per Season',
        description: 'Entry-level partnership for local businesses supporting grassroots football in Nginda.',
        benefits: [
          'Official recognition on the Nginda Warriors FC Sponsor Wall',
          'Social media partner appreciation mention',
          'Certificate of Official Club Partnership',
        ],
        isFeatured: false,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        tierCode: 'SILVER',
        name: 'Silver Club Partner',
        priceKes: null,
        billingPeriod: 'Per Season',
        description: 'Enhanced brand visibility across digital matchday graphics and community events.',
        benefits: [
          'Logo placement on the Official Website Sponsor Strip',
          'Brand inclusion on digital matchday fixture and result graphics',
          'Pitchside banner placement opportunity at home matches',
          'Invitation to official club community events',
        ],
        isFeatured: false,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        tierCode: 'GOLD',
        name: 'Gold Official Partner',
        priceKes: null,
        billingPeriod: 'Per Season',
        description: 'High-impact commercial partnership supporting first-team operations and youth development.',
        benefits: [
          'Prominent logo placement on training apparel or warm-up kits',
          'Dedicated partnership announcement article on the official website',
          'Priority branding at home fixtures and community outreach tournaments',
          'Collaborative community CSR activation with club leadership',
        ],
        isFeatured: true,
        publicationStatus: 'published',
        updatedAt: now,
      },
      {
        id: createUuid(),
        tierCode: 'MAIN_KIT',
        name: 'Main Kit Sponsor (Principal Partner)',
        priceKes: null,
        billingPeriod: 'Per Season / Multi-Season Agreement',
        description: 'Flagship front-of-shirt partnership at the heart of the Nginda Warriors FC identity.',
        benefits: [
          'Exclusive Front-of-Shirt branding on Official Home & Away Match Jerseys',
          'Headline placement across the Official Website, Match Centre & Media Backdrops',
          'Framed official signed team jersey & executive leadership partnership review',
          'Full custom commercial & community impact activation programme',
        ],
        isFeatured: true,
        publicationStatus: 'published',
        updatedAt: now,
      },
    ],
    sponsors: [],
    sponsorInquiries: [],
    agreements: [],
    fundraisingCampaigns: [],
    donations: [],
    expenditureRecords: [],
    transparencyReports: [],
    fanMemberships: [],
    recruitmentApplications: [],
    products: [],
    orders: [],
    fanVotes: [],
    contactMessages: [],
    notifications: [],
    auditLogs: [],
    integrationSettings: [
      {
        id: createUuid(),
        providerKey: 'safaricom_daraja',
        displayName: 'Safaricom Daraja M-Pesa API (STK Push & Paybill/Till)',
        isEnabled: false,
        environment: 'sandbox',
        publicConfig: {
          paybillNumber: '',
          tillNumber: '',
          accountPrefix: 'WARRIORS',
        },
        updatedAt: now,
      },
      {
        id: createUuid(),
        providerKey: 'supabase_cloud',
        displayName: 'Supabase PostgreSQL, Auth & Media Storage',
        isEnabled: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        environment: 'production',
        publicConfig: {
          projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        },
        updatedAt: now,
      },
      {
        id: createUuid(),
        providerKey: 'whatsapp_commerce',
        displayName: 'WhatsApp Merchandise Ordering & Supporter Desk',
        isEnabled: true,
        environment: 'production',
        publicConfig: {
          orderPhone: '',
        },
        updatedAt: now,
      },
    ],
  };
}

export function readDatabase(): NgindaDatabaseSchema {
  const filePath = getSharedDatabaseFilePath();
  if (!fs.existsSync(filePath)) {
    const initial = createInitialDatabaseState();
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as NgindaDatabaseSchema;
  } catch {
    const initial = createInitialDatabaseState();
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

export function writeDatabase(db: NgindaDatabaseSchema): void {
  const filePath = getSharedDatabaseFilePath();
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempPath, filePath);
}

export function recordAuditLog(
  db: NgindaDatabaseSchema,
  params: {
    actorUserId: string;
    actorName: string;
    actorRole: AdminRoleCode | 'PUBLIC_VISITOR' | 'SYSTEM';
    action: string;
    module: string;
    targetId?: string;
    summary: string;
  }
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: createUuid(),
    actorUserId: params.actorUserId,
    actorName: params.actorName,
    actorRole: params.actorRole,
    action: params.action,
    module: params.module,
    targetId: params.targetId,
    summary: params.summary,
    createdAt: new Date().toISOString(),
  };
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  return entry;
}

export function createNotification(
  db: NgindaDatabaseSchema,
  params: {
    title: string;
    message: string;
    category: AdminNotification['category'];
    actionHref?: string;
  }
): AdminNotification {
  const item: AdminNotification = {
    id: createUuid(),
    title: params.title,
    message: params.message,
    category: params.category,
    isRead: false,
    actionHref: params.actionHref,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(item);
  return item;
}

// ==============================================================================
// PUBLIC READ SNAPSHOT (Strictly filters out drafts, unapproved records & PII)
// ==============================================================================
export interface PublicWebsiteSnapshot {
  clubSettings: ClubSettings;
  visibleHeroSlides: ClubSettings['heroSlides'];
  websiteSections: WebsiteSection[];
  seasons: Season[];
  competitions: Competition[];
  players: Player[];
  featuredPlayers: Player[];
  staff: StaffMember[];
  upcomingFixtures: Fixture[];
  liveFixtures: Fixture[];
  completedFixtures: Fixture[];
  nextMatch: Fixture | null;
  latestResult: Fixture | null;
  standings: StandingRow[];
  ngindaStanding: StandingRow | null;
  articles: Article[];
  galleryAlbums: GalleryAlbum[];
  mediaAssets: MediaAsset[];
  events: ClubEvent[];
  sponsorshipPackages: SponsorshipPackage[];
  approvedSponsors: Sponsor[];
  fundraisingCampaigns: FundraisingCampaign[];
  confirmedDonationsSummary: {
    totalConfirmedKes: number;
    confirmedCount: number;
    recentPublicContributions: Array<{
      id: string;
      campaignTitle: string;
      donorDisplayName: string;
      amountKes: number;
      verifiedAt?: string;
    }>;
  };
  publishedExpenditures: ExpenditureRecord[];
  transparencyReports: TransparencyReport[];
  products: MerchandiseProduct[];
  motmPollSummary: Record<string, { totalVotes: number; byPlayerId: Record<string, number> }>;
  mpesaPublicConfig: {
    isEnabled: boolean;
    paybillNumber: string;
    tillNumber: string;
    accountPrefix: string;
  };
}

export function getPublicWebsiteSnapshot(): PublicWebsiteSnapshot {
  const db = readDatabase();

  // Only published & active players; protect underage player personal biography details if flagged
  const publishedPlayers = db.players
    .filter((p) => p.publicationStatus === 'published' && p.squadStatus === 'active')
    .map((p) => ({
      ...p,
      biography: p.isUnderageProtected
        ? 'Official Nginda Warriors FC Youth Squad Member (Protected Underage Athlete Profile).'
        : p.biography,
    }))
    .sort((a, b) => a.jerseyNumber - b.jerseyNumber);

  const featuredPlayers = publishedPlayers.filter((p) => p.isFeatured);

  const publishedStaff = db.staff
    .filter((s) => s.publicationStatus === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const publishedFixtures = db.fixtures.filter((f) => f.publicationStatus === 'published');

  const liveFixtures = publishedFixtures.filter((f) =>
    ['live_first_half', 'halftime', 'live_second_half'].includes(f.matchStatus)
  );

  const upcomingFixtures = publishedFixtures
    .filter((f) => f.matchStatus === 'scheduled')
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime());

  const completedFixtures = publishedFixtures
    .filter((f) => f.matchStatus === 'fulltime')
    .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime());

  const nextMatch = liveFixtures[0] || upcomingFixtures[0] || null;
  const latestResult = completedFixtures[0] || null;

  const publishedStandings = db.standings
    .filter((s) => s.publicationStatus === 'published')
    .sort((a, b) => a.position - b.position);

  const ngindaStanding =
    publishedStandings.find(
      (s) => s.isNgindaWarriors || s.clubName.toLowerCase().includes('nginda warriors')
    ) || null;

  const publishedArticles = db.articles
    .filter((a) => a.publicationStatus === 'published')
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

  const publishedAlbums = db.galleryAlbums
    .filter((g) => g.publicationStatus === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const publishedMedia = db.mediaAssets
    .filter((m) => m.publicationStatus === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const publishedEvents = db.events
    .filter((e) => e.publicationStatus === 'published')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const publishedPackages = db.sponsorshipPackages.filter(
    (p) => p.publicationStatus === 'published'
  );

  // Strictly only approved & published sponsors
  const approvedSponsors = db.sponsors.filter(
    (s) => s.isApproved === true && s.publicationStatus === 'published'
  );

  const publishedCampaigns = db.fundraisingCampaigns.filter(
    (c) => c.publicationStatus === 'published'
  );

  // Strictly only confirmed donations count toward public totals; protect donor personal details
  const confirmedDonations = db.donations.filter((d) => d.status === 'confirmed');
  const totalConfirmedKes = confirmedDonations.reduce((acc, d) => acc + Number(d.amountKes || 0), 0);

  const publishedExpenditures = db.expenditureRecords
    .filter((e) => e.publicationStatus === 'published')
    .sort((a, b) => new Date(b.spentDate).getTime() - new Date(a.spentDate).getTime());

  const publishedTransparencyReports = db.transparencyReports
    .filter((t) => t.publicationStatus === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const publishedProducts = db.products.filter((p) => p.publicationStatus === 'published');

  const motmPollSummary: Record<string, { totalVotes: number; byPlayerId: Record<string, number> }> = {};
  for (const vote of db.fanVotes) {
    if (!motmPollSummary[vote.fixtureId]) {
      motmPollSummary[vote.fixtureId] = { totalVotes: 0, byPlayerId: {} };
    }
    motmPollSummary[vote.fixtureId].totalVotes += 1;
    motmPollSummary[vote.fixtureId].byPlayerId[vote.playerId] =
      (motmPollSummary[vote.fixtureId].byPlayerId[vote.playerId] || 0) + 1;
  }

  const darajaSetting = db.integrationSettings.find((i) => i.providerKey === 'safaricom_daraja');

  return {
    clubSettings: db.clubSettings,
    visibleHeroSlides: db.clubSettings.heroSlides
      .filter((s) => s.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, 5),
    websiteSections: db.websiteSections
      .filter((s) => s.publicationStatus === 'published' && s.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder),
    seasons: db.seasons,
    competitions: db.competitions.filter((c) => c.isActive),
    players: publishedPlayers,
    featuredPlayers: featuredPlayers.length > 0 ? featuredPlayers : publishedPlayers.slice(0, 4),
    staff: publishedStaff,
    upcomingFixtures,
    liveFixtures,
    completedFixtures,
    nextMatch,
    latestResult,
    standings: publishedStandings,
    ngindaStanding,
    articles: publishedArticles,
    galleryAlbums: publishedAlbums,
    mediaAssets: publishedMedia,
    events: publishedEvents,
    sponsorshipPackages: publishedPackages,
    approvedSponsors,
    fundraisingCampaigns: publishedCampaigns,
    confirmedDonationsSummary: {
      totalConfirmedKes,
      confirmedCount: confirmedDonations.length,
      recentPublicContributions: confirmedDonations.slice(0, 10).map((d) => ({
        id: d.id,
        campaignTitle: d.campaignTitle,
        donorDisplayName: d.isAnonymous || !d.donorName ? 'Warrior Supporter' : d.donorName.split(' ')[0] + ' ***',
        amountKes: d.amountKes,
        verifiedAt: d.verifiedAt,
      })),
    },
    publishedExpenditures,
    transparencyReports: publishedTransparencyReports,
    products: publishedProducts,
    motmPollSummary,
    mpesaPublicConfig: {
      isEnabled: Boolean(darajaSetting?.isEnabled),
      paybillNumber: darajaSetting?.publicConfig?.paybillNumber || '',
      tillNumber: darajaSetting?.publicConfig?.tillNumber || '',
      accountPrefix: darajaSetting?.publicConfig?.accountPrefix || 'WARRIORS',
    },
  };
}

// ==============================================================================
// STANDINGS AUTO-CALCULATION HELPER FROM VERIFIED MATCH RESULTS
// ==============================================================================
export function recalculateStandingsFromVerifiedFixtures(
  db: NgindaDatabaseSchema,
  competitionName: string,
  seasonName: string
): StandingRow[] {
  const comp = db.competitions.find(
    (c) => c.name === competitionName && c.seasonName === seasonName
  );
  const ptsWin = comp?.pointsForWin ?? 3;
  const ptsDraw = comp?.pointsForDraw ?? 1;
  const ptsLoss = comp?.pointsForLoss ?? 0;

  const verifiedMatches = db.fixtures.filter(
    (f) =>
      f.competitionName === competitionName &&
      f.seasonName === seasonName &&
      f.matchStatus === 'fulltime' &&
      f.publicationStatus === 'published' &&
      typeof f.homeScore === 'number' &&
      typeof f.awayScore === 'number'
  );

  const tableMap = new Map<
    string,
    {
      clubName: string;
      isNgindaWarriors: boolean;
      played: number;
      won: number;
      drawn: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
    }
  >();

  const ensureTeam = (clubName: string, isNginda: boolean) => {
    const key = clubName.trim().toLowerCase();
    if (!tableMap.has(key)) {
      tableMap.set(key, {
        clubName: clubName.trim(),
        isNgindaWarriors: isNginda,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      });
    }
    return tableMap.get(key)!;
  };

  for (const match of verifiedMatches) {
    const ngindaScore = match.isHome ? match.homeScore! : match.awayScore!;
    const oppScore = match.isHome ? match.awayScore! : match.homeScore!;

    const ngindaRow = ensureTeam('Nginda Warriors FC', true);
    const oppRow = ensureTeam(match.opponentName, false);

    ngindaRow.played += 1;
    oppRow.played += 1;
    ngindaRow.goalsFor += ngindaScore;
    ngindaRow.goalsAgainst += oppScore;
    oppRow.goalsFor += oppScore;
    oppRow.goalsAgainst += ngindaScore;

    if (ngindaScore > oppScore) {
      ngindaRow.won += 1;
      oppRow.lost += 1;
    } else if (ngindaScore === oppScore) {
      ngindaRow.drawn += 1;
      oppRow.drawn += 1;
    } else {
      ngindaRow.lost += 1;
      oppRow.won += 1;
    }
  }

  const sorted = Array.from(tableMap.values())
    .map((row) => {
      const gd = row.goalsFor - row.goalsAgainst;
      const pts = row.won * ptsWin + row.drawn * ptsDraw + row.lost * ptsLoss;
      return { ...row, goalDifference: gd, points: pts };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.clubName.localeCompare(b.clubName);
    });

  // Replace standings for this competition + season
  db.standings = db.standings.filter(
    (s) => !(s.competitionName === competitionName && s.seasonName === seasonName)
  );

  const now = new Date().toISOString();
  const createdRows: StandingRow[] = sorted.map((item, idx) => ({
    id: createUuid(),
    competitionId: comp?.id,
    competitionName,
    seasonName,
    position: idx + 1,
    clubName: item.clubName,
    isNgindaWarriors: item.isNgindaWarriors,
    played: item.played,
    won: item.won,
    drawn: item.drawn,
    lost: item.lost,
    goalsFor: item.goalsFor,
    goalsAgainst: item.goalsAgainst,
    goalDifference: item.goalDifference,
    points: item.points,
    publicationStatus: 'published',
    updatedAt: now,
  }));

  db.standings.push(...createdRows);
  return createdRows;
}

export { hasModulePermission };
