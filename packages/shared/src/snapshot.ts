import {
  Article,
  ClubEvent,
  ClubSettings,
  Competition,
  ExpenditureRecord,
  Fixture,
  FundraisingCampaign,
  GalleryAlbum,
  MediaAsset,
  MerchandiseProduct,
  NgindaDatabaseSchema,
  Player,
  Season,
  Sponsor,
  SponsorshipPackage,
  StaffMember,
  StandingRow,
  TransparencyReport,
  WebsiteSection,
} from './types';

export interface PublicWebsiteSnapshot {
  clubSettings: ClubSettings;
  visibleHeroSlides: ClubSettings['heroSlides'];
  websiteSections: WebsiteSection[];
  seasons: Season[];
  competitions: Competition[];
  players: Player[];
  featuredPlayers: Player[];
  staff: StaffMember[];
  fixtures: Fixture[];
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

/**
 * Pure, environment-agnostic calculation of the public website snapshot from a database schema.
 * Safe to execute on both server (Node/Edge) and client (browser React state / workers).
 */
export function buildPublicSnapshot(db: NgindaDatabaseSchema): PublicWebsiteSnapshot {
  const safeDb = db || {
    clubSettings: {
      officialName: 'Nginda Warriors FC',
      shortName: 'Nginda Warriors',
      tagline: 'Courage. Community. Football.',
      primaryColor: '#08783E',
      secondaryColor: '#FDE100',
      accentColor: '#000000',
      crestUrl: '/brand/nginda-warriors-crest.png',
      homeGround: 'Nginda Stadium, Murang’a County',
      officialEmail: 'info@ngindawarriors.co.ke',
      officialPhone: '+254 720 000 000',
      socialLinks: {},
      heroSlides: [],
    },
    websiteSections: [],
    seasons: [],
    competitions: [],
    players: [],
    staff: [],
    fixtures: [],
    standings: [],
    articles: [],
    galleryAlbums: [],
    mediaAssets: [],
    events: [],
    sponsorshipPackages: [],
    sponsors: [],
    fundraisingCampaigns: [],
    donations: [],
    expenditureRecords: [],
    transparencyReports: [],
    products: [],
    fanVotes: [],
    integrationSettings: [],
  };

  const playersList = safeDb.players || [];
  const publishedPlayers = playersList
    .filter((p) => p.publicationStatus === 'published' && p.squadStatus === 'active')
    .map((p) => ({
      ...p,
      biography: p.isUnderageProtected
        ? 'Official Nginda Warriors FC Youth Squad Member (Protected Underage Athlete Profile).'
        : p.biography,
    }))
    .sort((a, b) => (a.jerseyNumber || 0) - (b.jerseyNumber || 0));

  const featuredPlayers = publishedPlayers.filter((p) => p.isFeatured);

  const staffList = safeDb.staff || [];
  const publishedStaff = staffList
    .filter((s) => s.publicationStatus === 'published')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const fixturesList = safeDb.fixtures || [];
  const publishedFixtures = fixturesList.filter((f) => f.publicationStatus === 'published');

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

  const standingsList = safeDb.standings || [];
  const publishedStandings = standingsList
    .filter((s) => s.publicationStatus === 'published')
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const ngindaStanding =
    publishedStandings.find(
      (s) => s.isNgindaWarriors || (s.clubName && s.clubName.toLowerCase().includes('nginda warriors'))
    ) || null;

  const articlesList = safeDb.articles || [];
  const publishedArticles = articlesList
    .filter((a) => a.publicationStatus === 'published')
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

  const galleryAlbumsList = safeDb.galleryAlbums || [];
  const publishedAlbums = galleryAlbumsList
    .filter((g) => g.publicationStatus === 'published')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const mediaAssetsList = safeDb.mediaAssets || [];
  const publishedMedia = mediaAssetsList
    .filter((m) => m.publicationStatus === 'published')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const eventsList = safeDb.events || [];
  const publishedEvents = eventsList
    .filter((e) => e.publicationStatus === 'published')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const packagesList = safeDb.sponsorshipPackages || [];
  const publishedPackages = packagesList.filter(
    (p) => p.publicationStatus === 'published'
  );

  const sponsorsList = safeDb.sponsors || [];
  const approvedSponsors = sponsorsList.filter(
    (s) => s.isApproved === true && s.publicationStatus === 'published'
  );

  const campaignsList = safeDb.fundraisingCampaigns || [];
  const publishedCampaigns = campaignsList.filter(
    (c) => c.publicationStatus === 'published'
  );

  const donationsList = safeDb.donations || [];
  const confirmedDonations = donationsList.filter((d) => d.status === 'confirmed');
  const totalConfirmedKes = confirmedDonations.reduce((acc, d) => acc + Number(d.amountKes || 0), 0);

  const expendituresList = safeDb.expenditureRecords || [];
  const publishedExpenditures = expendituresList
    .filter((e) => e.publicationStatus === 'published')
    .sort((a, b) => new Date(b.spentDate).getTime() - new Date(a.spentDate).getTime());

  const reportsList = safeDb.transparencyReports || [];
  const publishedTransparencyReports = reportsList
    .filter((t) => t.publicationStatus === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const productsList = safeDb.products || [];
  const publishedProducts = productsList.filter((p) => p.publicationStatus === 'published');

  const motmPollSummary: Record<string, { totalVotes: number; byPlayerId: Record<string, number> }> = {};
  const fanVotesList = safeDb.fanVotes || [];
  for (const vote of fanVotesList) {
    if (!motmPollSummary[vote.fixtureId]) {
      motmPollSummary[vote.fixtureId] = { totalVotes: 0, byPlayerId: {} };
    }
    motmPollSummary[vote.fixtureId].totalVotes += 1;
    motmPollSummary[vote.fixtureId].byPlayerId[vote.playerId] =
      (motmPollSummary[vote.fixtureId].byPlayerId[vote.playerId] || 0) + 1;
  }

  const integrationSettingsList = safeDb.integrationSettings || [];
  const darajaSetting = integrationSettingsList.find((i) => i.providerKey === 'safaricom_daraja');

  const rawSlides = safeDb.clubSettings?.heroSlides || [];
  const visibleHeroSlides = rawSlides
    .filter((s) => s.isVisible)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 5);

  const rawSections = safeDb.websiteSections || [];
  const websiteSections = rawSections
    .filter((s) => s.publicationStatus === 'published' && s.isVisible)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const competitionsList = safeDb.competitions || [];

  return {
    clubSettings: safeDb.clubSettings,
    visibleHeroSlides,
    websiteSections,
    seasons: safeDb.seasons || [],
    competitions: competitionsList.filter((c) => c.isActive),
    players: publishedPlayers,
    featuredPlayers: featuredPlayers.length > 0 ? featuredPlayers : publishedPlayers.slice(0, 4),
    staff: publishedStaff,
    fixtures: publishedFixtures,
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
      recentPublicContributions: confirmedDonations.slice(0, 8).map((d) => ({
        id: d.id,
        campaignTitle:
          campaignsList.find((c) => c.id === d.campaignId)?.title || 'Club General Fund',
        donorDisplayName: d.isAnonymous
          ? 'Proud Anonymous Supporter'
          : d.donorName || 'Nginda Fan',
        amountKes: d.amountKes,
        verifiedAt: d.verifiedAt || d.createdAt,
      })),
    },
    publishedExpenditures,
    transparencyReports: publishedTransparencyReports,
    products: publishedProducts,
    motmPollSummary,
    mpesaPublicConfig: {
      isEnabled: darajaSetting?.isEnabled ?? true,
      paybillNumber: darajaSetting?.config?.businessShortCode || '247247',
      tillNumber: darajaSetting?.config?.tillNumber || '987654',
      accountPrefix: 'NGINDA-',
    },
  };
}
