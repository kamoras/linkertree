import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Exports a page's captured email leads as CSV. Owner-only.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const page = await prisma.page.findUnique({
    where: { id },
    select: { userId: true, slug: true },
  });
  if (!page || page.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  const leads = await prisma.lead.findMany({
    where: { pageId: id },
    orderBy: { createdAt: "desc" },
    select: { email: true, createdAt: true },
  });

  function csvCell(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
  }

  const rows = [
    "email,subscribed_at",
    ...leads.map((l) => `${csvCell(l.email)},${csvCell(l.createdAt.toISOString())}`),
  ];

  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${page.slug}-leads.csv"`,
    },
  });
}
