import PortfolioApp from "@/app/test/PortfolioApp";
import { getWorks } from "@/actions/works";
import { getAbout } from "@/actions/about";

export default async function Home({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w: slug } = await searchParams;
  const [works, about] = await Promise.all([getWorks(), getAbout()]);
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
    />
  );
}
