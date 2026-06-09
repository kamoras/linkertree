import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const description =
  "The open-source, self-hostable link-in-bio platform. Build a beautiful page for all your links — with analytics, custom themes and more — free forever.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linkertree — one link for everything you do",
    template: "%s · Linkertree",
  },
  description,
  applicationName: "Linkertree",
  keywords: [
    "link in bio",
    "linktree alternative",
    "open source",
    "self-hosted",
    "bio link",
    "links page",
  ],
  authors: [{ name: "Linkertree" }],
  creator: "Linkertree",
  openGraph: {
    type: "website",
    siteName: "Linkertree",
    url: "/",
    title: "Linkertree — one link for everything you do",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkertree — one link for everything you do",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
