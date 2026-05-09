import PortfolioApp from "@/app/test/PortfolioApp";
import { getWorks } from "@/actions/works";
import { getAbout } from "@/actions/about";
import { getSettings } from "@/actions/settings";

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.toLowerCase();
  const [works, about, settings] = await Promise.all([getWorks(), getAbout(), getSettings()]);
  const initialCards = works.map((w, i) => ({
    id: i,
    name: w.title,
    desc: w.description || w.client,
    img: w.thumbnail || "",
    slug: w.slug,
  }));
  return (
    <PortfolioApp
      initialCards={initialCards}
      initialSlug={slug}
      sidebarLabel={about.sidebarLabel}
      sidebarDesc={about.sidebarDesc}
      homepageVideo={settings?.homepageVideo || ""}
    />
  );
}
