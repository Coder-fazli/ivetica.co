import type { Metadata } from "next";
import "./bootstrap-grid.css";
import "./globals.css";
import "./test/test.css";
import { ClerkProvider } from "@clerk/nextjs";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";
import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lvetica.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lvetica — Influencer Marketing & Content Studio",
    template: "%s | Lvetica",
  },
  description: "Lvetica is a full-service influencer marketing and content studio. We connect brands with creators, produce UGC, and manage social media growth.",
  keywords: ["influencer marketing", "UGC production", "content strategy", "social media management", "brand partnerships"],
  openGraph: { type: "website", siteName: "Lvetica", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

type SiteSettingsData = {
  logoUrl?: string;
  logoUrlLight?: string;
  faviconUrl?: string;
  fontSizes?: {
    heroTagline?: number;
    cardTitle?: number;
    cardDesc?: number;
    workTitle?: number;
    workBody?: number;
    contactLabel?: number;
    contactLink?: number;
  };
};

const getSettings = unstable_cache(
  async () => {
    try {
      await dbConnect();
      const s = await SiteSettings.findById("global").lean() as SiteSettingsData | null;
      console.log("[getSettings] Fetched from DB:", { logoUrl: !!s?.logoUrl, logoUrlLight: !!s?.logoUrlLight, faviconUrl: !!s?.faviconUrl });
      if (!s) {
        console.warn("[getSettings] No settings document found in DB, creating default");
      }
      return {
        logoUrl: s?.logoUrl || "",
        logoUrlLight: s?.logoUrlLight || "",
        faviconUrl: s?.faviconUrl || "",
        fontSizes: s?.fontSizes || {},
        tagline: (s as Record<string, unknown>)?.tagline as string || "DOING WHAT MATTERS",
      };
    } catch (err) {
      console.error("[getSettings] Error fetching settings:", err instanceof Error ? err.message : String(err));
      return { logoUrl: "", logoUrlLight: "", faviconUrl: "", fontSizes: {} };
    }
  },
  ["site-settings"],
  { revalidate: 300, tags: ["site-settings"] }
);

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { logoUrl, logoUrlLight, faviconUrl, fontSizes, tagline } = await getSettings();
  const fs = fontSizes as SiteSettingsData["fontSizes"] ?? {};

  const cssVars = `
    :root {
      --fs-hero: ${fs?.heroTagline ?? 15}px;
      --fs-card-title: ${fs?.cardTitle ?? 16}px;
      --fs-card-desc: ${fs?.cardDesc ?? 14}px;
      --fs-work-title: ${fs?.workTitle ?? 30}px;
      --fs-work-body: ${fs?.workBody ?? 13}px;
      --fs-contact-label: ${fs?.contactLabel ?? 11}px;
      --fs-contact-link: ${fs?.contactLink ?? 14}px;
    }
  `;

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script dangerouslySetInnerHTML={{ __html: `
            window.addEventListener('error', function(e) {
              var msg = e.message || '';
              if (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Failed to load chunk') !== -1 || msg.indexOf('Loading chunk') !== -1) {
                if (!sessionStorage.getItem('chunk_reload')) {
                  sessionStorage.setItem('chunk_reload', '1');
                  window.location.reload();
                }
              }
            });
          `}} />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css" />
          {faviconUrl && <link rel="icon" href={faviconUrl} />}
          <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        </head>
        <body data-logo={logoUrl || undefined} data-logo-light={logoUrlLight || undefined} data-tagline={tagline || undefined}>
          <ChunkErrorHandler />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
