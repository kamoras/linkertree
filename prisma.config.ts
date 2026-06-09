import { defineConfig } from "prisma/config";

// Prisma 7 moved the datasource connection URL out of schema.prisma and into
// this config file (used by CLI commands like `prisma db push`/`migrate`).
// The runtime client connects via a driver adapter — see lib/prisma.ts.
//
// Read the URL lazily from the environment (not via prisma's `env()` helper,
// which throws at config-load time if the var is unset). `prisma generate`
// runs in postinstall before DATABASE_URL is guaranteed and doesn't need it;
// only db push/migrate do, and they run later in the build with it set.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // CLI commands (db push / migrate) should use a direct (non-pooled)
    // connection when one is available, falling back to DATABASE_URL otherwise.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
