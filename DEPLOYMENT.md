# NGINDA WARRIORS FC — DEPLOYMENT GUIDE

This repository is engineered to support both **Unified Multi-Service Deployment** (deploying as a single Vercel project with automated routing) and **Independent Project Deployment** (deploying as two separate Vercel projects).

---

## Architecture Overview

```
                                      ┌────────────────────────────────────────┐
                                      │           Vercel Deployment            │
                                      └───────────────────┬────────────────────┘
                                                          │
                                   ┌──────────────────────┴──────────────────────┐
                                   ▼                                             ▼
                        ┌──────────────────────┐                      ┌──────────────────────┐
                        │    public-website    │                      │    control-centre    │
                        │ (Public Club Portal) │                      │ (Admin SaaS Center)  │
                        │   Path: / (root)     │                      │   Path: /manage      │
                        └──────────┬───────────┘                      └──────────┬───────────┘
                                   │                                             │
                                   └──────────────────────┬──────────────────────┘
                                                          ▼
                                            ┌───────────────────────────┐
                                            │ Shared Engine / Supabase  │
                                            │ PostgreSQL / File System  │
                                            └───────────────────────────┘
```

---

## Option 1: Unified Multi-Service Deployment (Recommended)

Using the preconfigured `vercel.json`, this monorepo deploys directly as a **single Vercel project**:

- **Public Website Portal**: Served on `https://<your-domain>/`
- **Admin Control Centre**: Served on `https://<your-domain>/manage`
- **Admin API Handlers**: Routed directly to the control centre backend

### Deployment Steps:
1. In the Vercel Dashboard, click **Add New > Project** and select this Git repository.
2. Keep the **Root Directory** as `.` (leave it blank or root default).
3. Vercel automatically detects `vercel.json` and builds both services:
   - `public-website` (`apps/public-website`)
   - `control-centre` (`apps/control-centre`)
4. Configure your environment variables in the Vercel project settings:
   ```env
   NEXT_PUBLIC_SITE_URL=https://<your-domain>
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ADMIN_JWT_SECRET=generate-a-strong-random-64-character-jwt-secret
   SUPER_ADMIN_SETUP_TOKEN=your-one-time-owner-setup-token
   ```
5. Click **Deploy**.
6. Visit `https://<your-domain>/manage` to complete the initial Super Admin Ownership Bootstrap.

---

## Option 2: Deploying as Two Independent Vercel Projects

If you prefer deploying the public portal and the admin center to completely separate domains or subdomains (e.g. `ngindawarriorsfc.co.ke` and `manage.ngindawarriorsfc.co.ke`):

### Application A: Public Website
1. In Vercel, click **Add New > Project** and select the repository.
2. In Project Settings, set **Root Directory** to `apps/public-website`.
3. Set Environment Variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://ngindawarriorsfc.co.ke
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Attach domain `ngindawarriorsfc.co.ke`.

### Application B: Control Centre
1. In Vercel, click **Add New > Project** and import the same repository.
2. In Project Settings, set **Root Directory** to `apps/control-centre`.
3. Set Environment Variables:
   ```env
   NEXT_PUBLIC_ADMIN_URL=https://manage.ngindawarriorsfc.co.ke
   NEXT_PUBLIC_BASE_PATH=""
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ADMIN_JWT_SECRET=generate-a-strong-random-64-character-jwt-secret
   SUPER_ADMIN_SETUP_TOKEN=your-one-time-owner-setup-token
   ```
4. Attach domain `manage.ngindawarriorsfc.co.ke`.

---

## Supabase PostgreSQL Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Run `supabase/migrations/0001_nginda_warriors_schema.sql` to instantiate the 37 normalized tables and Row Level Security (RLS) policies.
4. Copy your project URL and API keys from `Project Settings > API`.
