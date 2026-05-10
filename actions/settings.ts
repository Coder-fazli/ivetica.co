"use server";

import dbConnect from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { unstable_cache } from "next/cache";

export const getSettings = unstable_cache(
  async () => {
    await dbConnect();
    const s = await SiteSettings.findById("global").lean();
    return s ? JSON.parse(JSON.stringify(s)) : null;
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);
