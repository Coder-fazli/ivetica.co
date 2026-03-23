"use server";

import dbConnect from "@/lib/mongodb";
import { PageSeo } from "@/models/PageSeo";

export type PageSeoData = { metaTitle: string; metaDescription: string };

export async function getPageSeo(page: string): Promise<PageSeoData> {
  await dbConnect();
  const doc = await PageSeo.findOne({ page }).lean() as PageSeoData | null;
  return doc ?? { metaTitle: "", metaDescription: "" };
}

export async function updatePageSeo(page: string, data: PageSeoData): Promise<void> {
  await dbConnect();
  await PageSeo.findOneAndUpdate({ page }, { ...data, page }, { upsert: true, new: true });
}
