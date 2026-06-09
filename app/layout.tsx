import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const description =
  "Everything you are, in one simple link in bio — for free. The open-source, self-hostable link-in-bio with analytics, custom themes, scheduling, embeds and email capture. Every Pro feature, zero dollars.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linkertree — one link in bio, every Pro feature free",
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
    title: "Linkertree — one link in bio, every Pro feature free",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkertree — one link in bio, every Pro feature free",
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
