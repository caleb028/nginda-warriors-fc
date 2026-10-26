# NGINDA WARRIORS FC
## Official Football Website + Separate Private Admin Control Centre

Established in 2024, **Nginda Warriors FC** is a community-rooted football club built on discipline, competitive ambition, and sporting excellence.

This monorepo contains two completely separate, production-ready full-stack applications sharing a secure backend, database schema, and live content synchronization engine:

- **APPLICATION A: NGINDA WARRIORS FC OFFICIAL WEBSITE** (`https://ngindawarriorsfc.co.ke` | Local: `http://localhost:3000`)
  The public-facing website for supporters, players, prospective sponsors, businesses, the local community, and other visitors. Accessible without requiring visitors to create accounts.
- **APPLICATION B: NGINDA WARRIORS CONTROL CENTRE** (`https://manage.ngindawarriorsfc.co.ke` | Local: `http://localhost:3001`)
  The private administrative application owned and controlled by the primary Super Administrator, with its own independent layout, dark green sidebar, clean white workspace, yellow highlights, and SaaS operational modules.

---

## 1. Official Club Identity & Crest

The official crest features:
- A circular yellow (`#F5D000`) and green (`#08783E` / `#063B25`) badge
- A powerful warrior wearing a helmet
- Crossed spears
- A football
- Decorative laurel elements
- The words **"NGINDA WARRIORS FC"**
- The founding year **"EST. 2024"**

Preserved faithfully as an inline vector component (`ClubCrest`) and SVG asset (`/brand/nginda-warriors-crest.svg`). Super Admins can update or replace with a high-resolution transparent asset from the Brand Settings Editor in the Control Centre.

### Official Brand Colour & Typography System
- **Primary Canvas**: Clean, crisp white (`#FFFFFF`) with airy light surfaces (`#F8FAFC`, `#F1F5F9`)
- **Minimal Strategic Accents**: Warrior Green (`#08783E` / `#063B25`), Crest Yellow (`#F5D000`), Golden Accent (`#D5AA00`)
- **Display Typography**: **Pedals®** / **Chakra Petch** Athletic Speed Display typeface (Forward Italic, chamfered cuts, heavy athletic weight)
- **Body Typography**: **Inter** Clean Modern Sans-Serif

Centralized CSS variables are injected across both apps and editable live from the Control Centre.

---

## 2. Architecture & Monorepo Structure

```
nginda-warriors-fc/
├── apps/
│   ├── public-website/          # Application A: Public Club Portal (Port 3000)
│   │   ├── src/app/             # Next.js App Router (Home, About, Team, Fixtures, Standings, News, Gallery, Sponsors, Support, Transparency, etc.)
│   │   ├── src/components/      # Mobile-first navigation, Hero slideshow, Match countdown, M-Pesa forms, Proposal PDF generator
│   │   └── vercel.json          # Independent Vercel deployment config
│   │
│   └── control-centre/          # Application B: Private Admin Dashboard (Port 3001)
│       ├── src/app/             # Super Admin Bootstrap (/setup), Login (/login), RBAC API routes (/api/admin/action)
│       ├── src/components/      # 60s Live Match Scoreboard, Squad CRUD, Brand Settings, CMS, CRM, M-Pesa Reconciliation
│       └── vercel.json          # Independent Vercel deployment config (Disallows search engine indexing)
│
├── packages/
│   └── shared/                  # Shared domain types, SVG Crest, Zod schemas, DB engine, Daraja M-Pesa, RBAC & Auth
│
├── data/
│   └── nginda-warriors-db.json  # Synchronized shared database engine (Real-time updates between apps)
│
├── supabase/
│   └── migrations/              # Normalized PostgreSQL schema for all 37 tables + Row Level Security (RLS)
│
└── tests/
    └── acceptance.test.ts       # 20 Automated Acceptance Criteria Tests
```

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm

### Running the Applications
```bash
# 1. Start Application A (Public Website) on port 3000
npm run dev:public

# 2. Start Application B (Nginda Warriors Control Centre) on port 3001
npm run dev:admin

# 3. Run full automated test suite (verifying all 20 acceptance criteria)
npm test
```

Visit:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Control Centre**: [http://localhost:3001](http://localhost:3001)

---

## 4. Initial Super Admin Ownership Bootstrap (Zero Hardcoded Credentials)

1. Open [http://localhost:3001](http://localhost:3001) in your browser.
2. Because no credentials are ever hardcoded, you will be greeted by the **Initial Super Administrator Ownership Bootstrap** screen.
3. Enter your **Full Name**, **Email Address**, and choose a **Master Password** (minimum 8 characters).
4. Click **Establish Super Admin Ownership**.
5. The setup gate locks permanently and authenticates you as the primary protected `SUPER_ADMIN`.
6. From that moment on, sign in via the standard login modal.

---

## 5. Live Admin-to-Website Synchronization Workflow

- **Squad Directory**: Add and publish a player in the Control Centre (`Football > Players`) → Immediately visible on [http://localhost:3000/team](http://localhost:3000/team).
- **60-Second Mobile Match Centre**: Create a fixture (`Football > Fixtures`) → Open `Match Centre` → Tap `+` or `-` on home/away score, choose Phase (`Live 1st Half`, `Halftime`, `Fulltime`) and tap **Publish Live Score** → The public hero and match centre at [http://localhost:3000](http://localhost:3000) updates instantaneously!
- **Brand Palette Customizer**: Change brand colors or upload a new crest URL (`Content > Homepage Editor` or `System > Website Settings`) → Injected immediately into CSS variables across both applications.
- **Sponsor Approvals**: Inquiries submitted through the public website (`/sponsors`) arrive in `Commercial > Sponsor Inquiries`. When you approve a sponsor, they appear on the public sponsor strip and sponsor wall.
- **M-Pesa & Financial Transparency**: Donations start as `pending`. When verified via Daraja callback or marked confirmed by the Finance official, they reflect in verified campaign progress and public financial transparency totals.

---

## 6. Testing & Acceptance Criteria

Run the test suite anytime:
```bash
node --import tsx --test tests/acceptance.test.ts
```
All 21 specification criteria are verified:
- [x] Official Crest preserved & rendered faithfully
- [x] White-dominant canvas with strategic green and yellow accents
- [x] Separate frontend architectures and deployment configs
- [x] Super Admin login & bootstrap ownership
- [x] Add and publish squad players
- [x] Create fixtures
- [x] 60-Second live score updating
- [x] Publish news articles
- [x] Live homepage and brand token editing
- [x] Upload and approve sponsors
- [x] Sponsor inquiries CRM
- [x] Private draft isolation (drafts strictly excluded from public)
- [x] RBAC server authorization
- [x] Mobile-optimized match updates
- [x] Payment verification safeguards
- [x] Form validation (Zod)
- [x] Honest empty states (zero fake data policy)
- [x] High performance public snapshots (< 50ms)
- [x] Independent deployment readiness
- [x] Auto-standings calculation from verified results
- [x] Content deletion removes records from public website and audit log
