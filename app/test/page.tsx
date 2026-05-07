import PortfolioApp from "./PortfolioApp";
import { getWorks } from "@/actions/works";

export default async function TestPage() {
  const works = await getWorks();
  const initialCards = works.map((w, i) => ({
    id: i,
    name: w.title,
    desc: w.description || w.client,
    img: w.thumbnail || "",
    slug: w.slug,
  }));
  return <PortfolioApp initialCards={initialCards} />;
}
