import PortfolioApp from "@/app/test/PortfolioApp";
import { getWorks } from "@/actions/works";

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
