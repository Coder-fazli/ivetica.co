import PortfolioApp from "@/app/test/PortfolioApp";
import { getWorks } from "@/actions/works";

export default async function Home({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w: slug } = await searchParams;
  const works = await getWorks();
  const initialCards = works.map((w, i) => ({
    id: i,
    name: w.title,
    desc: w.description || w.client,
    img: w.thumbnail || "",
    slug: w.slug,
  }));
  return <PortfolioApp initialCards={initialCards} initialSlug={slug} />;
}
