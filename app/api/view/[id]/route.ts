import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Records a page view, deduped per visitor (one row per pageId+visitId). Called
// as a fire-and-forget beacon from the public page.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // The client sends the real external referrer (document.referrer); the
  // request's own Referer header would just be the linktree page itself.
  let referrer: string | null = null;
  try {
    const body = await req.json();
    if (typeof body?.referrer === "string" && body.referrer.trim()) {
      referrer = body.referrer.trim().slice(0, 300);
    }
  } catch {
    // no/invalid body — count as a direct view
  }

  const visitId = (await cookies()).get("lt_vid")?.value ?? null;

  try {
    const page = await prisma.page.findUnique({
      where: { id },
      select: { id: true },
    });
    if (page) {
      // Upsert on (pageId, visitId) so a visitor is only counted once.
      // A null visitId (cookies blocked) just inserts a fresh row each time.
      if (visitId) {
        await prisma.pageView.upsert({
          where: { pageId_visitId: { pageId: id, visitId } },
          create: { pageId: id, visitId, referrer },
          update: {},
        });
      } else {
        await prisma.pageView.create({ data: { pageId: id, referrer } });
      }
    }
  } catch {
    // ignore — analytics must never break the page
  }

  return NextResponse.json({ ok: true });
}
