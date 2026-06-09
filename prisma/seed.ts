import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Seeds a demo account so you can try the app immediately.
// Login:  demo@linkertree.dev  /  password123
async function main() {
  const email = "demo@linkertree.dev";
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo User", passwordHash },
  });

  const page = await prisma.page.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      userId: user.id,
      slug: "demo",
      title: "Demo User",
      bio: "This is a demo Linkertree page ✨",
      theme: "sunset",
    },
  });

  const links = [
    { title: "My Website", url: "https://example.com" },
    { title: "GitHub", url: "https://github.com" },
    { title: "Say hello 👋", url: "mailto:hello@example.com" },
  ];

  // Only seed links if the page has none yet.
  const existing = await prisma.link.count({ where: { pageId: page.id } });
  if (existing === 0) {
    await prisma.link.createMany({
      data: links.map((l, i) => ({ ...l, pageId: page.id, position: i })),
    });
  }

  console.log(`Seeded demo account: ${email} / password123 → /demo`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
