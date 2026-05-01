import { getWorks } from "@/actions/works";
import AllWorksPage from "./AllWorksPage";

export const dynamic = "force-dynamic";

export default async function AllPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const works = await getWorks();
  return <AllWorksPage works={works} initialTag={tag} />;
}
