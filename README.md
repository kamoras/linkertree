# 🌿 Linkertree

An **open-source, MIT-licensed, free** link-in-bio platform — a self-hostable
alternative to Linktree. Sign up users, give each of them as many link pages as
they want, and deploy the whole thing to Vercel's free tier in minutes.

Free, self-hosted versions of the features Linktree charges for:

- 🔐 **Email + password accounts** (NextAuth, no third-party OAuth required)
- 🌳 **Many linktrees per user** — one account, unlimited pages
- 📊 **Analytics** — page views, clicks, CTR, top links & traffic sources (last 30 days)
- 🎨 **Custom appearance** — 6 themes plus custom accent color, background image, button shape & font
- 🧱 **Link power-ups** — thumbnails, scheduling (show/hide by date), featured links, drag-to-reorder
- 🔗 **Social icon row** + **media embeds** (YouTube / Spotify)
- ✉️ **Email lead capture** with CSV export
- 🏷️ **Remove branding** toggle · 📱 **QR code** for every page
- 🚀 **Deploy free on Vercel** with a free Postgres database
- 🧩 Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 7

---

## Quick start (local)

Requires Node 20+ and a **PostgreSQL** database. The quickest local DB is Docker:

```bash
docker run --name linkertree-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=linkertree -p 5432:5432 -d postgres:16
```

…or use a free dev database from [Neon](https://neon.tech) / [Supabase](https://supabase.com).

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env
# then set DATABASE_URL to your Postgres connection string, and
# set NEXTAUTH_SECRET — generate one with:  openssl rand -base64 32

# 3. Create the database tables
npx prisma db push

# 4. (optional) seed a demo account → demo@linkertree.dev / password123
npm run db:seed

# 5. Run it
npm run dev
```

Open <http://localhost:3000>, register an account, and you'll land in the
dashboard with your first page ready to edit. Public pages live at
`http://localhost:3000/<handle>`.

---

## How it works

| Route | What it is |
| --- | --- |
| `/` | Marketing landing page |
| `/register`, `/login` | Account onboarding |
| `/dashboard` | Lists all of a user's pages; create new ones |
| `/dashboard/[id]` | Edit a page: settings, theme, links, live preview |
| `/[slug]` | The public linktree page |
| `/api/click/[id]` | Click-tracking redirect |

Data model (`prisma/schema.prisma`): a **User** has many **Page**s, and each
**Page** has many **Link**s.

---

## Deploy to Vercel (free)

The app uses **PostgreSQL** (Prisma 7 connects through the node-postgres driver
adapter). The free tiers of [Neon](https://neon.tech),
[Supabase](https://supabase.com), or
[Vercel Postgres](https://vercel.com/storage/postgres) all work.

1. **Create a free Postgres database** and copy its connection string.

2. **Push to GitHub**, then import the repo at
   [vercel.com/new](https://vercel.com/new).

3. **Set Environment Variables** in the Vercel project:

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | your Postgres connection string |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |

4. **Deploy.** The `build` script runs `prisma db push` automatically, so your
   tables are created/synced against Postgres on every deploy — no manual
   migration step needed.

That's it — a free, fully self-owned Linktree.

---

## Customizing

- **Themes** live in [`lib/themes.ts`](lib/themes.ts). Add an entry and it shows
  up in the dashboard picker automatically.
- **Reserved handles** (so users can't claim `dashboard`, `api`, etc.) are in
  [`lib/validation.ts`](lib/validation.ts).
- The public page renderer is [`components/linktree-view.tsx`](components/linktree-view.tsx).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate client, sync schema, build |
| `npm run db:push` | Sync the schema to your database |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed` | Seed the demo account |

## License

[MIT](LICENSE) — free to use, modify, and self-host.
