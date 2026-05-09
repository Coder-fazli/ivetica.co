"use server";

import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";
import { WorkType } from "@/types";
import { unstable_cache, revalidateTag } from "next/cache";

function stripIds(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(stripIds);
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (k === "_id" || k === "__v") continue;
      result[k] = stripIds(v);
    }
    return result;
  }
  return obj;
}

const getCachedWorks = unstable_cache(
  async () => {
    await dbConnect();
    const data = await Work.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(data)) as WorkType[];
  },
  ["all-works"],
  { revalidate: 300, tags: ["works"] }
);

const getCachedWorkBySlug = unstable_cache(
  async (slug: string) => {
    await dbConnect();
    const data = await Work.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(data)) as WorkType | null;
  },
  ["work-by-slug"],
  { revalidate: 300, tags: ["works"] }
);

export async function getWorks(): Promise<WorkType[]> {
  return getCachedWorks();
}

export async function getWorkBySlug(slug: string): Promise<WorkType | null> {
  return getCachedWorkBySlug(slug);
}

export async function createWork(data: Partial<WorkType>): Promise<{ success: boolean }> {
  await dbConnect();
  const clean = stripIds(data) as Partial<WorkType>;
  await Work.create(clean);
  return { success: true };
}

export async function updateWork(slug: string, data: Partial<WorkType>): Promise<{ success: boolean }> {
  await dbConnect();
  const clean = stripIds(data) as Partial<WorkType>;
  await Work.findOneAndUpdate({ slug }, { $set: clean }, { runValidators: false });
  return { success: true };
}

export async function deleteWork(slug: string): Promise<{ success: boolean }> {
  await dbConnect();
  await Work.deleteOne({ slug });
  return { success: true };
}

export async function reorderWorks(slugs: string[]): Promise<{ success: boolean }> {
  await dbConnect();
  await Promise.all(slugs.map((slug, i) => Work.updateOne({ slug }, { order: i })));
  revalidateTag("works");
  return { success: true };
}
