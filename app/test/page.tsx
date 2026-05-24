import PortfolioApp from "./PortfolioApp";
import { getWorks } from "@/actions/works";
import { getAbout } from "@/actions/about";

export default async function TestPage() {
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
      sidebarLabel={about.sidebarLabel}
      sidebarDesc={about.studioText1}
    />
  );
}
