import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Records a click then redirects to the link's destination. Used by public
// pages so clicks are counted without exposing the dashboard.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const link = await prisma.link.findUnique({ where: { id } });

  if (!link || !link.active) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  // Best-effort increment; never block the redirect on a write failure.
  try {
    await prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });
  } catch {
    // ignore
  }

  return NextResponse.redirect(link.url);
}
