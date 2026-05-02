import { getWorks } from "@/actions/works";
import PortfolioApp from "@/app/test/PortfolioApp";

export const dynamic = "force-dynamic";

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const works = await getWorks();
  const initialCards = works.map((work, i) => ({
    id: i,
    name: work.title,
    desc: work.description || work.client,
    img: work.thumbnail || "",
    slug: work.slug,
  }));

  return <PortfolioApp initialCards={initialCards} initialSlug={slug} />;
}
