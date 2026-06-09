# 🌿 Linkertree

An **open-source, MIT-licensed, free** link-in-bio platform — a self-hostable
alternative to Linktree. Sign up users, give each of them as many link pages as
they want, and deploy the whole thing to Vercel's free tier in minutes.

- 🔐 **Email + password accounts** (NextAuth, no third-party OAuth required)
- 🌳 **Many linktrees per user** — one account, unlimited pages
- 🎨 **Six built-in themes**, live editor preview, drag-free reordering
- 📊 **Click tracking** per link
- 🚀 **Deploy free on Vercel** with a free Postgres database
- 🧩 Next.js 14 (App Router) · TypeScript · Tailwind · Prisma

---

## Quick start (local)

Requires Node 18+.

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env
# then set NEXTAUTH_SECRET — generate one with:  openssl rand -base64 32

# 3. Create the database (SQLite by default — zero setup)
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

SQLite doesn't persist on Vercel's serverless filesystem, so production uses
Postgres. The free tiers of [Neon](https://neon.tech),
[Supabase](https://supabase.com), or
[Vercel Postgres](https://vercel.com/storage/postgres) all work.

1. **Switch the Prisma provider** in `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create a free Postgres database** and copy its connection string.

3. **Push to GitHub**, then import the repo at
   [vercel.com/new](https://vercel.com/new).

4. **Set Environment Variables** in the Vercel project:

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | your Postgres connection string |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |

5. **Deploy.** The `build` script runs `prisma db push` automatically, so your
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
