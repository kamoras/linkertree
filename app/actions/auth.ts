"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, slugSchema } from "@/lib/validation";

export type ActionResult = { ok: true } | { ok: false; error: string };

// Turn an email/name into a candidate handle, then ensure it's unique.
async function uniqueSlugFromSeed(seed: string): Promise<string> {
  let base = seed
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (base.length < 3) base = `user-${base}`;
  base = base.slice(0, 28);

  let candidate = base;
  let n = 1;
  // Loop until we find an unused slug.
  while (
    !slugSchema.safeParse(candidate).success ||
    (await prisma.page.findUnique({ where: { slug: candidate } }))
  ) {
    candidate = `${base}-${n}`.slice(0, 32);
    n += 1;
    if (n > 10000) {
      candidate = `user-${Date.now().toString(36)}`;
      break;
    }
  }
  return candidate;
}

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with that email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await uniqueSlugFromSeed(
    (name && name.length ? name : email.split("@")[0]) || "user"
  );

  // Create the user with a first linktree ready to go.
  await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
      pages: {
        create: {
          slug,
          title: name && name.length ? name : "My Links",
          bio: "Welcome to my links!",
          theme: "midnight",
        },
      },
    },
  });

  return { ok: true };
}
