-- ==============================================================================
-- NGINDA WARRIORS FC — OFFICIAL POSTGRESQL & SUPABASE DATABASE MIGRATION
-- Established 2024 | Shared Backend for Public Website & Private Control Centre
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL CHECK (code IN ('SUPER_ADMIN', 'CLUB_ADMIN', 'CONTENT_EDITOR', 'MATCH_OFFICIAL', 'FINANCE_MANAGER')),
  name TEXT NOT NULL,
  description TEXT,
  is_system_protected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PERMISSIONS
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code TEXT NOT NULL REFERENCES roles(code) ON DELETE CASCADE,
  module TEXT NOT NULL,
  can_read BOOLEAN NOT NULL DEFAULT TRUE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_update BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  can_publish BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(role_code, module)
);

-- 3. USERS (Administrative Accounts)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role_code TEXT NOT NULL REFERENCES roles(code),
  is_owner_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Protect primary Super Admin from accidental deletion or privilege removal
CREATE OR REPLACE FUNCTION protect_owner_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_owner_super_admin = TRUE THEN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Protected Owner Super Admin account cannot be deleted.';
    END IF;
    IF NEW.role_code <> 'SUPER_ADMIN' OR NEW.is_active = FALSE OR NEW.is_owner_super_admin = FALSE THEN
      RAISE EXCEPTION 'Protected Owner Super Admin privileges cannot be revoked or deactivated.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_owner_super_admin ON users;
CREATE TRIGGER trg_protect_owner_super_admin
BEFORE UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION protect_owner_super_admin();

-- 4. CLUB SETTINGS (Brand Tokens, Typography, Crest, Contact & SEO)
CREATE TABLE IF NOT EXISTS club_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name TEXT NOT NULL DEFAULT 'Nginda Warriors FC',
  short_name TEXT NOT NULL DEFAULT 'Nginda Warriors',
  established_year INTEGER NOT NULL DEFAULT 2024,
  tagline TEXT NOT NULL DEFAULT 'One Team. One Community. One Warrior Spirit.',
  crest_url TEXT NOT NULL DEFAULT '/brand/nginda-warriors-crest.svg',
  warrior_green TEXT NOT NULL DEFAULT '#08783E',
  deep_forest_green TEXT NOT NULL DEFAULT '#063B25',
  crest_yellow TEXT NOT NULL DEFAULT '#F5D000',
  golden_accent TEXT NOT NULL DEFAULT '#D5AA00',
  soft_ivory TEXT NOT NULL DEFAULT '#FFFDF2',
  light_green_bg TEXT NOT NULL DEFAULT '#EEF7EF',
  neutral_grey TEXT NOT NULL DEFAULT '#F2F4F2',
  charcoal TEXT NOT NULL DEFAULT '#17231C',
  heading_font TEXT NOT NULL DEFAULT 'Barlow Condensed',
  body_font TEXT NOT NULL DEFAULT 'Inter',
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp_number TEXT,
  physical_address TEXT,
  county TEXT DEFAULT 'Murang''a County, Kenya',
  home_ground_name TEXT,
  training_ground_name TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero_slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  club_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. WEBSITE SECTIONS (Homepage & Public Page Section Controls)
CREATE TABLE IF NOT EXISTS website_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  primary_cta_label TEXT,
  primary_cta_href TEXT,
  secondary_cta_label TEXT,
  secondary_cta_href TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('draft', 'published', 'archived')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SEASONS
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. COMPETITIONS
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT,
  season_id UUID REFERENCES seasons(id) ON DELETE SET NULL,
  competition_type TEXT NOT NULL DEFAULT 'league' CHECK (competition_type IN ('league', 'cup', 'friendly', 'tournament')),
  points_for_win INTEGER NOT NULL DEFAULT 3,
  points_for_draw INTEGER NOT NULL DEFAULT 1,
  points_for_loss INTEGER NOT NULL DEFAULT 0,
  tiebreaker_rules TEXT NOT NULL DEFAULT 'Points > Goal Difference > Goals For > Head-to-Head',
  is_verified_source BOOLEAN NOT NULL DEFAULT FALSE,
  verification_note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PLAYERS
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  jersey_number INTEGER NOT NULL,
  position_group TEXT NOT NULL CHECK (position_group IN ('Goalkeepers', 'Defenders', 'Midfielders', 'Forwards')),
  specific_role TEXT NOT NULL,
  photo_url TEXT,
  biography TEXT,
  preferred_foot TEXT CHECK (preferred_foot IN ('Right', 'Left', 'Both')),
  is_underage_protected BOOLEAN NOT NULL DEFAULT FALSE,
  appearances INTEGER NOT NULL DEFAULT 0,
  starts INTEGER NOT NULL DEFAULT 0,
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  yellow_cards INTEGER NOT NULL DEFAULT 0,
  red_cards INTEGER NOT NULL DEFAULT 0,
  clean_sheets INTEGER NOT NULL DEFAULT 0,
  season_stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  squad_status TEXT NOT NULL DEFAULT 'active' CHECK (squad_status IN ('active', 'inactive', 'archived')),
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. STAFF (Technical Bench & Club Leadership)
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Technical Bench', 'Club Leadership')),
  photo_url TEXT,
  biography TEXT,
  public_email TEXT,
  public_phone TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. FIXTURES
CREATE TABLE IF NOT EXISTS fixtures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES seasons(id) ON DELETE SET NULL,
  competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
  competition_name TEXT NOT NULL,
  season_name TEXT NOT NULL,
  opponent_name TEXT NOT NULL,
  opponent_crest_url TEXT,
  venue TEXT NOT NULL,
  is_home BOOLEAN NOT NULL DEFAULT TRUE,
  kickoff_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Africa/Nairobi',
  match_status TEXT NOT NULL DEFAULT 'scheduled' CHECK (match_status IN ('scheduled', 'live_first_half', 'halftime', 'live_second_half', 'fulltime', 'postponed', 'cancelled')),
  home_score INTEGER,
  away_score INTEGER,
  motm_voting_open BOOLEAN NOT NULL DEFAULT FALSE,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. MATCH EVENTS (Goals, Cards, Substitutions, Timeline)
CREATE TABLE IF NOT EXISTS match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  minute INTEGER NOT NULL,
  added_time INTEGER DEFAULT 0,
  team_side TEXT NOT NULL CHECK (team_side IN ('nginda', 'opponent')),
  event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'penalty_goal', 'own_goal', 'yellow_card', 'red_card', 'substitution', 'halftime', 'fulltime', 'kickoff')),
  player_name TEXT NOT NULL,
  secondary_player_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. LINEUPS
CREATE TABLE IF NOT EXISTS lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  jersey_number INTEGER NOT NULL,
  position TEXT NOT NULL,
  is_starting BOOLEAN NOT NULL DEFAULT TRUE,
  is_captain BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. MATCH REPORTS
CREATE TABLE IF NOT EXISTS match_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID UNIQUE NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  author_name TEXT,
  attendance INTEGER,
  referee_name TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. STANDINGS
CREATE TABLE IF NOT EXISTS standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  competition_name TEXT NOT NULL,
  season_name TEXT NOT NULL,
  position INTEGER NOT NULL,
  club_name TEXT NOT NULL,
  club_crest_url TEXT,
  is_nginda_warriors BOOLEAN NOT NULL DEFAULT FALSE,
  played INTEGER NOT NULL DEFAULT 0,
  won INTEGER NOT NULL DEFAULT 0,
  drawn INTEGER NOT NULL DEFAULT 0,
  lost INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. CATEGORIES (Article Categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. ARTICLES (News & Content Management)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  category_name TEXT NOT NULL,
  featured_image_url TEXT,
  author_name TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'scheduled', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. GALLERY ALBUMS
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Matches', 'Training', 'Tournaments', 'Club events', 'Community outreach', 'Celebrations')),
  description TEXT,
  cover_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES gallery_albums(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  caption TEXT,
  category TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  external_video_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  image_url TEXT,
  registration_required BOOLEAN NOT NULL DEFAULT FALSE,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. SPONSORSHIP PACKAGES
CREATE TABLE IF NOT EXISTS sponsorship_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_code TEXT UNIQUE NOT NULL CHECK (tier_code IN ('BRONZE', 'SILVER', 'GOLD', 'MAIN_KIT')),
  name TEXT NOT NULL,
  price_kes NUMERIC(12, 2),
  billing_period TEXT NOT NULL DEFAULT 'Per Season',
  description TEXT NOT NULL,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. SPONSORS
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  tier_code TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  summary TEXT,
  agreement_start DATE,
  agreement_expiry DATE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. SPONSOR INQUIRIES
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  package_of_interest TEXT NOT NULL,
  budget_kes NUMERIC(12, 2),
  message TEXT NOT NULL,
  inquiry_status TEXT NOT NULL DEFAULT 'new' CHECK (inquiry_status IN ('new', 'contacted', 'in_discussion', 'approved', 'declined', 'archived')),
  private_admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. AGREEMENTS
CREATE TABLE IF NOT EXISTS agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  package_tier TEXT NOT NULL,
  contract_value_kes NUMERIC(12, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. FUNDRAISING CAMPAIGNS
CREATE TABLE IF NOT EXISTS fundraising_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Playing kits', 'Football equipment', 'Transport', 'Ground maintenance', 'Referee fees', 'Player welfare', 'Tournament participation')),
  description TEXT NOT NULL,
  image_url TEXT,
  target_amount_kes NUMERIC(12, 2) NOT NULL,
  verified_raised_kes NUMERIC(12, 2) NOT NULL DEFAULT 0,
  deadline DATE,
  paybill_number TEXT,
  till_number TEXT,
  account_reference TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. DONATIONS
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES fundraising_campaigns(id) ON DELETE SET NULL,
  campaign_title TEXT NOT NULL,
  donor_name TEXT,
  donor_phone TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  amount_kes NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'mpesa_stk' CHECK (payment_method IN ('mpesa_stk', 'mpesa_paybill', 'mpesa_till', 'bank_transfer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  mpesa_receipt_number TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. PAYMENT TRANSACTIONS (Daraja STK & Callback Reconciliation Ledger)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  merchant_request_id TEXT,
  checkout_request_id TEXT UNIQUE,
  phone_number_masked TEXT NOT NULL,
  amount_kes NUMERIC(12, 2) NOT NULL,
  account_reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  mpesa_receipt_number TEXT,
  result_code INTEGER,
  result_description TEXT,
  raw_callback_payload JSONB,
  reconciled_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. EXPENDITURE RECORDS
CREATE TABLE IF NOT EXISTS expenditure_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES fundraising_campaigns(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_kes NUMERIC(12, 2) NOT NULL,
  spent_date DATE NOT NULL,
  reference_code TEXT,
  approved_by_name TEXT NOT NULL,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. TRANSPARENCY REPORTS
CREATE TABLE IF NOT EXISTS transparency_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reporting_period TEXT NOT NULL,
  summary TEXT NOT NULL,
  total_confirmed_funds_kes NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_expenditure_kes NUMERIC(12, 2) NOT NULL DEFAULT 0,
  remaining_balance_kes NUMERIC(12, 2) NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 29. FAN MEMBERSHIPS
CREATE TABLE IF NOT EXISTS fan_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  ward_or_location TEXT,
  membership_tier TEXT NOT NULL DEFAULT 'Community Supporter',
  comm_sms BOOLEAN NOT NULL DEFAULT TRUE,
  comm_whatsapp BOOLEAN NOT NULL DEFAULT TRUE,
  comm_email BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 30. RECRUITMENT APPLICATIONS (Strictly Private — Never Publicly Exposed)
CREATE TABLE IF NOT EXISTS recruitment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  is_minor BOOLEAN NOT NULL DEFAULT FALSE,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_position TEXT NOT NULL,
  preferred_foot TEXT NOT NULL,
  playing_experience TEXT NOT NULL,
  county TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  achievements TEXT,
  highlight_video_url TEXT,
  application_status TEXT NOT NULL DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'shortlisted', 'invited_to_trial', 'not_selected', 'archived')),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 31. PRODUCTS (Merchandise)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Jerseys', 'Scarves', 'Caps', 'Training Shirts', 'Accessories')),
  description TEXT NOT NULL,
  price_kes NUMERIC(12, 2) NOT NULL,
  image_url TEXT,
  available_sizes JSONB NOT NULL DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'pre_order', 'out_of_stock')),
  whatsapp_order_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 32. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 33. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  selected_size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_kes NUMERIC(12, 2) NOT NULL,
  order_channel TEXT NOT NULL DEFAULT 'whatsapp' CHECK (order_channel IN ('whatsapp', 'mpesa')),
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 34. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 35. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  action_href TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 36. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  target_id TEXT,
  summary TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 37. INTEGRATION SETTINGS
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  public_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fundraising_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenditure_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read-only policies strictly restricted to published/approved records
CREATE POLICY "Public read club_settings" ON club_settings FOR SELECT USING (true);
CREATE POLICY "Public read published sections" ON website_sections FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published active players" ON players FOR SELECT USING (publication_status = 'published' AND squad_status = 'active');
CREATE POLICY "Public read published staff" ON staff FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published fixtures" ON fixtures FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published standings" ON standings FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published albums" ON gallery_albums FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published media" ON media_assets FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published events" ON events FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published packages" ON sponsorship_packages FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read approved published sponsors" ON sponsors FOR SELECT USING (is_approved = true AND publication_status = 'published');
CREATE POLICY "Public read published campaigns" ON fundraising_campaigns FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published expenditures" ON expenditure_records FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published transparency" ON transparency_reports FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Public read published products" ON products FOR SELECT USING (publication_status = 'published');
