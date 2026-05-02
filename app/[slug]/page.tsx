import PortfolioApp from "@/app/test/PortfolioApp";

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PortfolioApp initialCards={[]} initialSlug={slug} />;
}
