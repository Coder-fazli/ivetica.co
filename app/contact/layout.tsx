import type { Metadata } from "next";
import { getPageSeo } from "@/actions/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact");
  return {
    title: seo.metaTitle || "Contact",
    description: seo.metaDescription || "Get in touch with Lvetica. Reach out to discuss influencer campaigns, UGC production, or any partnership opportunities.",
    openGraph: {
      title: seo.metaTitle || "Contact — Lvetica",
      description: seo.metaDescription || "Reach out to discuss influencer campaigns and brand partnerships.",
      url: "/contact",
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
