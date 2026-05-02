import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./bootstrap-grid.css";
import "./globals.css";
import "./test/test.css";
import { ClerkProvider } from "@clerk/nextjs";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";
import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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

const getSettings = unstable_cache(
  async () => {
    try {
      await dbConnect();
      const s = await SiteSettings.findById("global").lean() as { logoUrl?: string; faviconUrl?: string } | null;
      return { logoUrl: s?.logoUrl || "", faviconUrl: s?.faviconUrl || "" };
    } catch {
      return { logoUrl: "", faviconUrl: "" };
    }
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { logoUrl, faviconUrl } = await getSettings();

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
        </head>
        <body className={outfit.className} data-logo={logoUrl || undefined}>
          <ChunkErrorHandler />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
