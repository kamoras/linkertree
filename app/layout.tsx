import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const description =
  "Bring together your links, content and socials on one beautiful page. Built-in analytics, custom themes, scheduling, embeds and email capture — all included, free to use.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linkertree — everything you are, in one simple link",
    template: "%s · Linkertree",
  },
  description,
  applicationName: "Linkertree",
  keywords: [
    "link in bio",
    "linktree alternative",
    "free link in bio",
    "bio link",
    "links page",
  ],
  authors: [{ name: "Linkertree" }],
  creator: "Linkertree",
  openGraph: {
    type: "website",
    siteName: "Linkertree",
    url: "/",
    title: "Linkertree — everything you are, in one simple link",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkertree — everything you are, in one simple link",
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
