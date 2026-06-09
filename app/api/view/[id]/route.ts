import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Records a page view. Called as a fire-and-forget beacon from the public page
// (client-side) so it isn't double-counted by static rendering or prefetches.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const referrer = req.headers.get("referer");

  try {
    const page = await prisma.page.findUnique({
      where: { id },
      select: { id: true },
    });
    if (page) {
      await prisma.pageView.create({ data: { pageId: id, referrer } });
    }
  } catch {
    // ignore — analytics must never break the page
  }

  return NextResponse.json({ ok: true });
}
