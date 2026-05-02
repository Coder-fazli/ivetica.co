"use server";

import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";
import { WorkType } from "@/types";

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
  await Work.create(data);
  return { success: true };
}

export async function updateWork(slug: string, data: Partial<WorkType>): Promise<{ success: boolean }> {
  await dbConnect();
  await Work.updateOne({ slug }, data);
  return { success: true };
}

export async function deleteWork(slug: string): Promise<{ success: boolean }> {
  await dbConnect();
  await Work.deleteOne({ slug });
  return { success: true };
}
