# NGINDA WARRIORS FC — DEPLOYMENT GUIDE
## Deploying Two Separate Applications to Vercel + Supabase

This platform is architected to deploy as **two independent Vercel projects** connected to a shared Supabase PostgreSQL backend while maintaining separate domains, environments, and authorization boundaries.

---

## 1. Domain Architecture

| Application | Suggested Production Domain | Vercel Root Directory |
|---|---|---|
| **Application A: Public Website** | `https://ngindawarriorsfc.co.ke` | `apps/public-website` |
| **Application B: Control Centre** | `https://manage.ngindawarriorsfc.co.ke` | `apps/control-centre` |

---

## 2. Supabase Backend Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run `supabase/migrations/0001_nginda_warriors_schema.sql` from this repository.
   - Creates all **37 normalized tables**
   - Configures the Owner Super Admin protection trigger
   - Enables **Row Level Security (RLS)** policies so the public `anon` role can ONLY read published/approved records and cannot view private recruitment applications, sponsor inquiries, admin accounts, or draft content.
4. Note your **Project URL**, **Anon Public Key**, and **Service Role Secret Key** from `Project Settings > API`.

---

## 3. Deploying Application A: Nginda Warriors FC Official Website

1. In the Vercel Dashboard, click **Add New > Project** and select this Git repository.
2. Configure Project Settings:
   - **Project Name**: `nginda-warriors-fc-public`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/public-website`
3. Environment Variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://ngindawarriorsfc.co.ke
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Click **Deploy**.
5. Under **Settings > Domains**, attach your production domain `ngindawarriorsfc.co.ke`.

---

## 4. Deploying Application B: Nginda Warriors Control Centre

1. In Vercel, click **Add New > Project** and import the same repository again.
2. Configure Project Settings:
   - **Project Name**: `nginda-warriors-control-centre`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/control-centre`
3. Environment Variables (Strictly Private Server Secrets):
   ```env
   NEXT_PUBLIC_ADMIN_URL=https://manage.ngindawarriorsfc.co.ke
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ADMIN_JWT_SECRET=generate-a-strong-random-64-character-jwt-secret
   SUPER_ADMIN_SETUP_TOKEN=your-one-time-owner-setup-token
   DARAJA_ENVIRONMENT=production
   DARAJA_CONSUMER_KEY=your-daraja-consumer-key
   DARAJA_CONSUMER_SECRET=your-daraja-consumer-secret
   DARAJA_SHORTCODE=your-shortcode
   DARAJA_PASSKEY=your-passkey
   DARAJA_CALLBACK_URL=https://ngindawarriorsfc.co.ke/api/mpesa/callback
   ```
4. Click **Deploy**.
5. Under **Settings > Domains**, attach your administrative domain `manage.ngindawarriorsfc.co.ke`.
6. Visit `https://manage.ngindawarriorsfc.co.ke` and complete the initial **Super Admin Ownership Bootstrap**!

---

## 5. Security & Verification Checklist

- [x] `apps/control-centre/src/app/robots.ts` disallows search engine indexing (`Disallow: /`).
- [x] Privileged secrets (`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_JWT_SECRET`, `DARAJA_CONSUMER_SECRET`) are never exposed in public client bundles (never prefixed with `NEXT_PUBLIC_`).
- [x] Owner Super Admin account is protected from accidental deletion or privilege demotion.
- [x] Donor phone numbers are masked on public transparency views.
- [x] Minor applicant safeguarding validation is strictly enforced.
