import { z } from 'zod';

// ==============================================================================
// 1. OFFICIAL BRAND DESIGN TOKENS
// ==============================================================================
export const INITIAL_BRAND_TOKENS = {
  warriorGreen: '#08783E',
  deepForestGreen: '#063B25',
  crestYellow: '#F5D000',
  goldenAccent: '#D5AA00',
  white: '#FFFFFF',
  softIvory: '#FFFDF2',
  lightGreenBg: '#EEF7EF',
  neutralGrey: '#F2F4F2',
  charcoal: '#17231C',
  headingFont: 'Barlow Condensed',
  bodyFont: 'Inter',
} as const;

export type PublicationStatus = 'draft' | 'scheduled' | 'published' | 'archived';

// ==============================================================================
// 2. ROLE-BASED ACCESS CONTROL (RBAC)
// ==============================================================================
export type AdminRoleCode =
  | 'SUPER_ADMIN'
  | 'CLUB_ADMIN'
  | 'CONTENT_EDITOR'
  | 'MATCH_OFFICIAL'
  | 'FINANCE_MANAGER';

export interface RoleDefinition {
  code: AdminRoleCode;
  name: string;
  description: string;
  isSystemProtected: boolean;
  allowedModules: string[];
}

export const ROLE_DEFINITIONS: Record<AdminRoleCode, RoleDefinition> = {
  SUPER_ADMIN: {
    code: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Primary system owner with unrestricted control across all club, content, commercial, community, and security modules.',
    isSystemProtected: true,
    allowedModules: ['*'],
  },
  CLUB_ADMIN: {
    code: 'CLUB_ADMIN',
    name: 'Club Administrator',
    description: 'Manages day-to-day club operations, players, technical staff, fixtures, content, community, and merchandise.',
    isSystemProtected: false,
    allowedModules: [
      'dashboard', 'activity', 'players', 'staff', 'fixtures', 'results', 'match-centre',
      'competitions', 'standings', 'homepage', 'club-info', 'news', 'gallery', 'media',
      'events', 'sponsors', 'sponsor-inquiries', 'merchandise', 'membership', 'recruitment',
      'voting', 'messages', 'reports', 'notifications',
    ],
  },
  CONTENT_EDITOR: {
    code: 'CONTENT_EDITOR',
    name: 'Content Editor',
    description: 'Manages homepage slides, club information, news articles, gallery albums, media library, and events.',
    isSystemProtected: false,
    allowedModules: [
      'dashboard', 'activity', 'homepage', 'club-info', 'news', 'gallery', 'media', 'events', 'notifications',
    ],
  },
  MATCH_OFFICIAL: {
    code: 'MATCH_OFFICIAL',
    name: 'Match Official',
    description: 'Authorized official for fixtures, live match score updates, lineups, match events, and match reports.',
    isSystemProtected: false,
    allowedModules: [
      'dashboard', 'activity', 'fixtures', 'results', 'match-centre', 'competitions', 'standings', 'notifications',
    ],
  },
  FINANCE_MANAGER: {
    code: 'FINANCE_MANAGER',
    name: 'Finance Manager',
    description: 'Manages sponsorship packages, sponsor agreements, fundraising campaigns, M-Pesa donations, expenditure records, and transparency reports.',
    isSystemProtected: false,
    allowedModules: [
      'dashboard', 'activity', 'sponsors', 'sponsor-inquiries', 'sponsorship-packages',
      'fundraising', 'donations', 'transparency', 'merchandise', 'reports', 'notifications',
    ],
  },
};

export function hasModulePermission(role: AdminRoleCode, moduleKey: string): boolean {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.allowedModules.includes('*') || def.allowedModules.includes(moduleKey);
}

// ==============================================================================
// 3. DOMAIN INTERFACES (All 37 Normalized Entities)
// ==============================================================================
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  roleCode: AdminRoleCode;
  isOwnerSuperAdmin: boolean;
  isActive: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  roleCode: AdminRoleCode;
  isOwnerSuperAdmin: boolean;
}

export interface HeroSlide {
  id: string;
  headline: string;
  tagline: string;
  description: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface ClubInfoSections {
  aboutSummary: string;
  historyNarrative: string;
  visionStatement: string;
  missionStatement: string;
  coreValues: Array<{ title: string; description: string }>;
  honoursAndMilestones: Array<{ year: string; title: string; description: string }>;
  homeGroundName: string;
  homeGroundAddress: string;
  homeGroundDescription: string;
  trainingGroundName: string;
  trainingGroundSchedule: string;
  trainingGroundDescription: string;
  communityImpactSummary: string;
  developmentObjectives: string[];
}

export interface ClubSettings {
  id: string;
  clubName: string;
  shortName: string;
  establishedYear: number;
  tagline: string;
  crestUrl: string;
  warriorGreen: string;
  deepForestGreen: string;
  crestYellow: string;
  goldenAccent: string;
  softIvory: string;
  lightGreenBg: string;
  neutralGrey: string;
  charcoal: string;
  headingFont: string;
  bodyFont: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  physicalAddress: string;
  county: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  seoMetadata: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
    canonicalBaseUrl: string;
  };
  heroSlides: HeroSlide[];
  clubInfo: ClubInfoSections;
  updatedAt: string;
}

export interface WebsiteSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  isVisible: boolean;
  displayOrder: number;
  publicationStatus: PublicationStatus;
  updatedAt: string;
}

export type PositionGroup = 'Goalkeepers' | 'Defenders' | 'Midfielders' | 'Forwards';

export interface PlayerSeasonStat {
  seasonName: string;
  competitionName: string;
  appearances: number;
  starts: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
}

export interface Player {
  id: string;
  slug: string;
  fullName: string;
  jerseyNumber: number;
  positionGroup: PositionGroup;
  specificRole: string;
  photoUrl?: string;
  biography: string;
  preferredFoot: 'Right' | 'Left' | 'Both';
  isUnderageProtected: boolean;
  appearances: number;
  starts: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  seasonStats: PlayerSeasonStat[];
  isFeatured: boolean;
  squadStatus: 'active' | 'inactive' | 'archived';
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  roleTitle: string;
  category: 'Technical Bench' | 'Club Leadership';
  photoUrl?: string;
  biography: string;
  publicEmail?: string;
  publicPhone?: string;
  displayOrder: number;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Competition {
  id: string;
  name: string;
  shortName: string;
  seasonId: string;
  seasonName: string;
  competitionType: 'league' | 'cup' | 'friendly' | 'tournament';
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  tiebreakerRules: string;
  isVerifiedSource: boolean;
  verificationNote: string;
  isActive: boolean;
}

export type MatchStatus =
  | 'scheduled'
  | 'live_first_half'
  | 'halftime'
  | 'live_second_half'
  | 'fulltime'
  | 'postponed'
  | 'cancelled';

export interface MatchEventItem {
  id: string;
  fixtureId: string;
  minute: number;
  addedTime?: number;
  teamSide: 'nginda' | 'opponent';
  eventType:
    | 'goal'
    | 'penalty_goal'
    | 'own_goal'
    | 'yellow_card'
    | 'red_card'
    | 'substitution'
    | 'halftime'
    | 'fulltime'
    | 'kickoff';
  playerName: string;
  secondaryPlayerName?: string;
  notes?: string;
  createdAt: string;
}

export interface MatchLineupEntry {
  id: string;
  fixtureId: string;
  playerId?: string;
  playerName: string;
  jerseyNumber: number;
  position: string;
  isStarting: boolean;
  isCaptain: boolean;
}

export interface MatchReport {
  id: string;
  fixtureId: string;
  headline: string;
  summary: string;
  body: string;
  authorName: string;
  attendance?: number;
  refereeName?: string;
  publishedAt: string;
}

export interface Fixture {
  id: string;
  seasonId?: string;
  competitionId?: string;
  competitionName: string;
  seasonName: string;
  opponentName: string;
  opponentCrestUrl?: string;
  venue: string;
  isHome: boolean;
  kickoffAt: string; // ISO string displayed in Africa/Nairobi
  timezone: string;
  matchStatus: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  motmVotingOpen: boolean;
  publicationStatus: PublicationStatus;
  events: MatchEventItem[];
  lineups: MatchLineupEntry[];
  report?: MatchReport | null;
  createdAt: string;
  updatedAt: string;
}

export interface StandingRow {
  id: string;
  competitionId?: string;
  competitionName: string;
  seasonName: string;
  position: number;
  clubName: string;
  clubCrestUrl?: string;
  isNgindaWarriors: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  publicationStatus: PublicationStatus;
  updatedAt: string;
}

export type ArticleCategoryName =
  | 'Club announcements'
  | 'Match reports'
  | 'Transfers'
  | 'Training updates'
  | 'Player interviews'
  | 'Community stories'
  | 'Sponsorship announcements'
  | 'Official notices';

export interface Article {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  body: string;
  categoryName: ArticleCategoryName;
  featuredImageUrl?: string;
  authorName: string;
  seoTitle?: string;
  seoDescription?: string;
  scheduledFor?: string;
  publishedAt?: string;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCategory =
  | 'Matches'
  | 'Training'
  | 'Tournaments'
  | 'Club events'
  | 'Community outreach'
  | 'Celebrations';

export interface GalleryAlbum {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  coverImageUrl?: string;
  displayOrder: number;
  publicationStatus: PublicationStatus;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  albumId?: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  mediaType: 'image' | 'video';
  url: string;
  externalVideoUrl?: string;
  displayOrder: number;
  publicationStatus: PublicationStatus;
  createdAt: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt?: string;
  imageUrl?: string;
  registrationRequired: boolean;
  publicationStatus: PublicationStatus;
  createdAt: string;
}

export type SponsorshipTierCode = 'BRONZE' | 'SILVER' | 'GOLD' | 'MAIN_KIT';

export interface SponsorshipPackage {
  id: string;
  tierCode: SponsorshipTierCode;
  name: string;
  priceKes: number | null; // null until configured by Super Admin (no fabricated pricing)
  billingPeriod: string;
  description: string;
  benefits: string[];
  isFeatured: boolean;
  publicationStatus: PublicationStatus;
  updatedAt: string;
}

export interface Sponsor {
  id: string;
  businessName: string;
  tierCode: SponsorshipTierCode;
  logoUrl: string;
  websiteUrl?: string;
  summary: string;
  agreementStart?: string;
  agreementExpiry?: string;
  isApproved: boolean;
  publicationStatus: PublicationStatus;
  createdAt: string;
}

export interface SponsorInquiry {
  id: string;
  contactName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  packageOfInterest: string;
  budgetKes?: number | null;
  message: string;
  inquiryStatus: 'new' | 'contacted' | 'in_discussion' | 'approved' | 'declined' | 'archived';
  privateAdminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorAgreement {
  id: string;
  sponsorId: string;
  sponsorName: string;
  packageTier: SponsorshipTierCode;
  contractValueKes: number;
  startDate: string;
  expiryDate: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  notes: string;
  createdAt: string;
}

export type CampaignCategory =
  | 'Playing kits'
  | 'Football equipment'
  | 'Transport'
  | 'Ground maintenance'
  | 'Referee fees'
  | 'Player welfare'
  | 'Tournament participation';

export interface FundraisingCampaign {
  id: string;
  title: string;
  category: CampaignCategory;
  description: string;
  imageUrl?: string;
  targetAmountKes: number;
  verifiedRaisedKes: number;
  deadline?: string;
  paybillNumber?: string;
  tillNumber?: string;
  accountReference: string;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentTransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface DonationRecord {
  id: string;
  campaignId?: string;
  campaignTitle: string;
  donorName?: string;
  donorPhoneMasked: string;
  isAnonymous: boolean;
  amountKes: number;
  paymentMethod: 'mpesa_stk' | 'mpesa_paybill' | 'mpesa_till' | 'bank_transfer';
  status: PaymentTransactionStatus;
  mpesaReceiptNumber?: string;
  checkoutRequestId?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface ExpenditureRecord {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  category: CampaignCategory | string;
  description: string;
  amountKes: number;
  spentDate: string;
  referenceCode?: string;
  approvedByName: string;
  publicationStatus: PublicationStatus;
  createdAt: string;
}

export interface TransparencyReport {
  id: string;
  title: string;
  reportingPeriod: string;
  summary: string;
  totalConfirmedFundsKes: number;
  totalExpenditureKes: number;
  remainingBalanceKes: number;
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  createdAt: string;
}

export interface FanMembership {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  wardOrLocation?: string;
  membershipTier: string;
  commSms: boolean;
  commWhatsapp: boolean;
  commEmail: boolean;
  status: 'pending' | 'active' | 'archived';
  createdAt: string;
}

export interface RecruitmentApplication {
  id: string;
  fullName: string;
  age: number;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
  guardianConsentConfirmed: boolean;
  preferredPosition: string;
  preferredFoot: 'Right' | 'Left' | 'Both';
  playingExperience: string;
  county: string;
  phoneNumber: string;
  email?: string;
  achievements?: string;
  highlightVideoUrl?: string;
  applicationStatus:
    | 'submitted'
    | 'under_review'
    | 'shortlisted'
    | 'invited_to_trial'
    | 'not_selected'
    | 'archived';
  reviewerNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MerchandiseProduct {
  id: string;
  name: string;
  slug: string;
  category: 'Jerseys' | 'Scarves' | 'Caps' | 'Training Shirts' | 'Accessories';
  description: string;
  priceKes: number;
  imageUrl?: string;
  availableSizes: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'pre_order' | 'out_of_stock';
  whatsappOrderEnabled: boolean;
  publicationStatus: PublicationStatus;
  createdAt: string;
}

export interface MerchandiseOrder {
  id: string;
  productId: string;
  productName: string;
  selectedSize: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  totalKes: number;
  orderChannel: 'whatsapp' | 'mpesa';
  orderStatus: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export interface FanVoteRecord {
  id: string;
  fixtureId: string;
  playerId: string;
  playerName: string;
  voterFingerprint: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: 'sponsor' | 'finance' | 'recruitment' | 'match' | 'community' | 'security';
  isRead: boolean;
  actionHref?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  actorName: string;
  actorRole: AdminRoleCode | 'PUBLIC_VISITOR' | 'SYSTEM';
  action: string;
  module: string;
  targetId?: string;
  summary: string;
  createdAt: string;
}

export interface IntegrationSetting {
  id: string;
  providerKey: 'safaricom_daraja' | 'supabase_cloud' | 'whatsapp_commerce' | 'sms_gateway';
  displayName: string;
  isEnabled: boolean;
  environment: 'sandbox' | 'production';
  publicConfig: Record<string, string>;
  updatedAt: string;
}

// ==============================================================================
// 4. VALIDATION SCHEMAS (ZOD)
// ==============================================================================
export const SponsorInquirySchema = z.object({
  contactName: z.string().min(2, 'Contact name is required'),
  businessName: z.string().min(2, 'Business name is required'),
  phoneNumber: z.string().min(9, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  packageOfInterest: z.string().min(2, 'Please select a sponsorship package'),
  budgetKes: z.number().nonnegative().optional().nullable(),
  message: z.string().min(10, 'Please include a short message (minimum 10 characters)'),
});

export const RecruitmentApplicationSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    age: z.number().int().min(10, 'Minimum age is 10').max(45, 'Maximum trial age is 45'),
    preferredPosition: z.string().min(2, 'Position is required'),
    preferredFoot: z.enum(['Right', 'Left', 'Both']),
    playingExperience: z.string().min(5, 'Playing experience details are required'),
    county: z.string().min(2, 'County is required'),
    phoneNumber: z.string().min(9, 'Valid phone number is required'),
    email: z.string().email().optional().or(z.literal('')),
    achievements: z.string().optional(),
    highlightVideoUrl: z.string().url().optional().or(z.literal('')),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianConsentConfirmed: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.age < 18) {
        return (
          Boolean(data.guardianName && data.guardianName.trim().length >= 2) &&
          Boolean(data.guardianPhone && data.guardianPhone.trim().length >= 9) &&
          data.guardianConsentConfirmed === true
        );
      }
      return true;
    },
    {
      message: 'Applicants under 18 years of age require verified parent/guardian name, phone number, and explicit consent.',
      path: ['guardianConsentConfirmed'],
    }
  );

export const FanMembershipSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(9, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  wardOrLocation: z.string().optional(),
  membershipTier: z.string().default('Community Supporter'),
  commSms: z.boolean().default(true),
  commWhatsapp: z.boolean().default(true),
  commEmail: z.boolean().default(false),
});

export const ContactMessageSchema = z.object({
  senderName: z.string().min(2, 'Your name is required'),
  senderEmail: z.string().email('Valid email address is required'),
  senderPhone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const MpesaContributionSchema = z.object({
  campaignId: z.string().optional(),
  campaignTitle: z.string().min(2),
  donorName: z.string().optional(),
  donorPhone: z.string().min(9, 'Valid Safaricom M-Pesa phone number is required'),
  isAnonymous: z.boolean().default(false),
  amountKes: z.number().min(10, 'Minimum M-Pesa contribution is KES 10'),
  paymentMethod: z.enum(['mpesa_stk', 'mpesa_paybill', 'mpesa_till']).default('mpesa_stk'),
});

// ==============================================================================
// 5. BILINGUAL DICTIONARY (ENGLISH & KISWAHILI)
// ==============================================================================
export const PUBLIC_TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      team: 'Team',
      fixtures: 'Fixtures',
      standings: 'Standings',
      news: 'News',
      gallery: 'Gallery',
      sponsors: 'Sponsors',
      contact: 'Contact',
      supportClub: 'Support the Club',
      membership: 'Membership',
      recruitment: 'Recruitment',
      merchandise: 'Merchandise',
      events: 'Events',
      transparency: 'Transparency',
    },
    hero: {
      exploreClub: 'Explore Our Club',
      partnerWithUs: 'Partner With Us',
      estBadge: 'ESTABLISHED 2024 • OFFICIAL CLUB PLATFORM',
    },
    sections: {
      matchCentre: 'MATCH CENTRE',
      nextFixture: 'NEXT FIXTURE',
      latestResult: 'LATEST VERIFIED RESULT',
      leaguePosition: 'LEAGUE STANDINGS SNAPSHOT',
      featuredSquad: 'FEATURED WARRIORS SQUAD',
      latestNews: 'LATEST CLUB NEWS',
      sponsorsStrip: 'OFFICIAL CLUB PARTNERS & SPONSORS',
      communityImpact: 'COMMUNITY IMPACT & DEVELOPMENT',
      finalCtaHeading: 'STAND WITH THE WARRIORS.',
      finalCtaBody: 'Support local football, empower talent, and help build the future of Nginda Warriors FC.',
      btnSupportClub: 'Support the Club',
      btnBecomeSponsor: 'Become a Sponsor',
      btnJoinCommunity: 'Join Our Community',
    },
  },
  sw: {
    nav: {
      home: 'Nyumbani',
      about: 'Kuhusu Klabu',
      team: 'Kikosi',
      fixtures: 'Ratiba na Matokeo',
      standings: 'Msimamo wa Ligi',
      news: 'Habari',
      gallery: 'Picha na Video',
      sponsors: 'Wadhamini',
      contact: 'Mawasiliano',
      supportClub: 'Changia Klabu',
      membership: 'Uanachama',
      recruitment: 'Majaribio ya Wachezaji',
      merchandise: 'Bidhaa za Klabu',
      events: 'Matukio',
      transparency: 'Uwazi wa Fedha',
    },
    hero: {
      exploreClub: 'ifahamu Klabu Yetu',
      partnerWithUs: 'Shirikiana Nasi',
      estBadge: 'IMEANZISHWA 2024 • JUKWAA RASMI LA KLABU',
    },
    sections: {
      matchCentre: 'KITUO CHA MECHI',
      nextFixture: 'MECHI IJAYO',
      latestResult: 'MATOKEO YA HIVI KARIBUNI',
      leaguePosition: 'MSIMAMO WA LIGI',
      featuredSquad: 'KIKOSI CHA NGUVU CHA WARRIORS',
      latestNews: 'HABARI MPYA ZA KLABU',
      sponsorsStrip: 'WADHAMINI NA WASHIRIKA RASMI',
      communityImpact: 'MCHANGO KWA JAMII NA UKUZAJI VIPAJI',
      finalCtaHeading: 'SIMAMA NA WARRIORS.',
      finalCtaBody: 'Saidia soka la nyumbani, inua vipaji, na ujenge mustakabali wa Nginda Warriors FC.',
      btnSupportClub: 'Changia Klabu',
      btnBecomeSponsor: 'Kuwa Mdhamini',
      btnJoinCommunity: 'Jiunge na Jamii Yetu',
    },
  },
} as const;

export type SupportedLocale = keyof typeof PUBLIC_TRANSLATIONS;

export interface NgindaDatabaseSchema {
  users: AdminUser[];
  clubSettings: ClubSettings;
  websiteSections: WebsiteSection[];
  seasons: Season[];
  competitions: Competition[];
  players: Player[];
  staff: StaffMember[];
  fixtures: Fixture[];
  standings: StandingRow[];
  articles: Article[];
  galleryAlbums: GalleryAlbum[];
  mediaAssets: MediaAsset[];
  events: ClubEvent[];
  sponsorshipPackages: SponsorshipPackage[];
  sponsors: Sponsor[];
  sponsorInquiries: SponsorInquiry[];
  agreements: SponsorAgreement[];
  fundraisingCampaigns: FundraisingCampaign[];
  donations: DonationRecord[];
  expenditureRecords: ExpenditureRecord[];
  transparencyReports: TransparencyReport[];
  fanMemberships: FanMembership[];
  recruitmentApplications: RecruitmentApplication[];
  products: MerchandiseProduct[];
  orders: MerchandiseOrder[];
  fanVotes: FanVoteRecord[];
  contactMessages: ContactMessage[];
  notifications: AdminNotification[];
  auditLogs: AuditLogEntry[];
  integrationSettings: IntegrationSetting[];
}
