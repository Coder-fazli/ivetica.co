import PortfolioApp from "@/app/test/PortfolioApp";

export default async function Home({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w: slug } = await searchParams;
  return <PortfolioApp initialCards={[]} initialSlug={slug} />;
}
