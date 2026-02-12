"use server";

import dbConnect from "@/lib/mongodb";
import { Homepage } from "@/models/Homepage";
import { HomepageType } from "@/types";

export async function getHomepage(): Promise<HomepageType | null> {
  await dbConnect();
  const data = await Homepage.findOne().lean();
  return data as HomepageType | null;
}

export async function updateHomepage(data: HomepageType): Promise<{ success: boolean }> {
  await dbConnect();
  const existing = await Homepage.findOne();

  if (existing) {
    await Homepage.updateOne({}, data);
  } else {
    await Homepage.create(data);
  }

  return { success: true };
}
