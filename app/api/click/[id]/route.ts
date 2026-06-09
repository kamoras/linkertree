import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Records a click then redirects to the link's destination. Used by public
// pages so clicks are counted without exposing the dashboard.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const link = await prisma.link.findUnique({ where: { id } });

  const home = new URL("/", req.url);
  if (!link || !link.active) {
    return NextResponse.redirect(home);
  }

  // Respect a scheduled visibility window.
  const now = new Date();
  if ((link.startsAt && link.startsAt > now) || (link.endsAt && link.endsAt < now)) {
    return NextResponse.redirect(home);
  }

  const referrer = req.headers.get("referer");

  // Best-effort analytics; never block the redirect on a write failure.
  try {
    await prisma.$transaction([
      prisma.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      }),
      prisma.clickEvent.create({
        data: { linkId: link.id, pageId: link.pageId, referrer },
      }),
    ]);
  } catch {
    // ignore
  }

  return NextResponse.redirect(link.url);
}
