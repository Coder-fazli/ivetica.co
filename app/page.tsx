import { getWorks } from "@/actions/works";
import PortfolioApp from "@/app/test/PortfolioApp";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w: slug } = await searchParams;
  const works = await getWorks();
  const initialCards = works.map((work, i) => ({
    id: i,
    name: work.title,
    desc: work.client,
    img: work.thumbnail || `/img/works/${(i % 6) + 1}.jpg`,
    slug: work.slug,
  }));

  return <PortfolioApp initialCards={initialCards} initialSlug={slug} />;
}
