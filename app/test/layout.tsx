import "./test.css";
import dbConnect from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { unstable_cache } from "next/cache";

const getSettings = unstable_cache(
  async () => {
    await dbConnect();
    return SiteSettings.findById("global").lean();
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

export default async function TestLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const fs = settings?.fontSizes ?? {};

  const cssVars = `
    :root {
      --fs-hero: ${fs.heroTagline ?? 15}px;
      --fs-card-title: ${fs.cardTitle ?? 16}px;
      --fs-card-desc: ${fs.cardDesc ?? 14}px;
      --fs-work-title: ${fs.workTitle ?? 30}px;
      --fs-work-body: ${fs.workBody ?? 13}px;
      --fs-contact-label: ${fs.contactLabel ?? 11}px;
      --fs-contact-link: ${fs.contactLink ?? 14}px;
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body
        data-logo={settings?.logoUrl || undefined}
        data-logo-light={settings?.logoUrlLight || undefined}
        data-tagline={settings?.tagline || undefined}
        data-homepage-video={(settings as Record<string, unknown>)?.homepageVideo as string || undefined}
      >
        {children}
      </body>
    </html>
  );
}
