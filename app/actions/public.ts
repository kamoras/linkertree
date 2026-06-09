"use server";

import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validation";

export type LeadResult = { ok: true } | { ok: false; error: string };

// Public, unauthenticated: store an email submitted from a page's subscribe
// form. Only succeeds when the page exists and has lead capture enabled.
export async function captureLead(
  pageId: string,
  _prev: LeadResult | undefined,
  formData: FormData
): Promise<LeadResult> {
  const parsed = leadSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { collectEmails: true },
  });
  if (!page || !page.collectEmails) {
    return { ok: false, error: "This page isn't collecting emails" };
  }

  try {
    await prisma.lead.create({ data: { pageId, email: parsed.data.email } });
  } catch {
    // Unique constraint (pageId, email) — treat a repeat as success.
  }
  return { ok: true };
}
