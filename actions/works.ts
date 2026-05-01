"use server";

import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";
import { WorkType } from "@/types";

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

export async function getWorks(): Promise<WorkType[]> {
  await dbConnect();
  const data = await Work.find().lean();
  return JSON.parse(JSON.stringify(data)) as WorkType[];
}

export async function getWorkBySlug(slug: string): Promise<WorkType | null> {
  await dbConnect();
  const data = await Work.findOne({ slug }).lean();
  return JSON.parse(JSON.stringify(data)) as WorkType | null;
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
