import { defineConfig, env } from "prisma/config";

// Prisma 7 moved the datasource connection URL out of schema.prisma and into
// this config file (used by CLI commands like `prisma db push`/`migrate`).
// The runtime client connects via a driver adapter — see lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
