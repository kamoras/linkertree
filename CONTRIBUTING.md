# Contributing to Linkertree

Thanks for your interest in improving Linkertree! Contributions of all kinds are
welcome — bug reports, features, docs, and themes.

## Getting started

1. Fork and clone the repo.
2. Install dependencies and set up your environment:

   ```bash
   npm install
   cp .env.example .env        # then set NEXTAUTH_SECRET
   npx prisma db push          # creates the local SQLite database
   npm run db:seed             # optional demo account
   npm run dev
   ```

3. Create a branch: `git checkout -b feat/my-change`.

## Before you open a PR

Run the same checks CI runs:

```bash
npm run lint        # ESLint
npm run build       # type-check + production build
```

Please make sure:

- The build passes with no type errors.
- New user-facing behavior is reflected in the README if relevant.
- Commits are focused and have clear messages.

## Project layout

```
app/                Next.js App Router (routes, server actions, API)
  actions/          Server actions (auth, page/link CRUD)
  dashboard/        Authenticated dashboard UI
  [slug]/           Public linktree pages
components/          Shared UI (LinktreeView)
lib/                Prisma client, auth config, themes, validation
prisma/             Schema, migrations, seed
.github/            Issue/PR templates and CI/CD workflows
```

## Adding a theme

Add an entry to [`lib/themes.ts`](lib/themes.ts) — it automatically appears in
the dashboard theme picker and on public pages. No other changes needed.

## Database changes

Edit [`prisma/schema.prisma`](prisma/schema.prisma), then sync your local
database:

```bash
npm run db:push
```

This starter uses Prisma's `db push` (schema-sync) rather than migration files,
so the same schema works against SQLite locally and Postgres in production. If
your fork needs versioned migrations, switch to `prisma migrate` and commit the
generated files in `prisma/migrations/`.

## Reporting bugs / requesting features

Use the [issue templates](.github/ISSUE_TEMPLATE). For security issues, see
[SECURITY.md](SECURITY.md) — please do **not** open a public issue.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By
participating, you agree to uphold it.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
