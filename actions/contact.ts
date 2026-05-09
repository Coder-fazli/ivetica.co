"use server";

import dbConnect from "@/lib/mongodb";
import { Contact } from "@/models/Contact";
import { unstable_cache, revalidateTag } from "next/cache";

export type ContactData = {
  emailBusiness: string;
  emailInfluencer: string;
  phone: string;
  location: string;
  mapEmbed: string;
};

const DEFAULTS: ContactData = {
  emailBusiness:   "salam@lvetica.co",
  emailInfluencer: "influencer@lvetica.co",
  phone:           "+994 10 505 06 66",
  location:        "pr 3141 Matbuat Avenue, Baku 1000",
  mapEmbed:        "",
};

const getCachedContact = unstable_cache(
  async () => {
    await dbConnect();
    const raw = await Contact.findOne().lean() as Record<string, unknown> | null;
    if (!raw) return DEFAULTS;
    const data = JSON.parse(JSON.stringify(raw));
    // Migrate old single "email" field to "emailBusiness"
    if (!data.emailBusiness && data.email) {
      data.emailBusiness = data.email;
    }
    return data as ContactData;
  },
  ["contact-data"],
  { revalidate: 300, tags: ["contact"] }
);

export async function getContact(): Promise<ContactData> {
  return getCachedContact();
}

export async function updateContact(data: ContactData): Promise<{ success: boolean }> {
  await dbConnect();
  const existing = await Contact.findOne();
  if (existing) {
    await Contact.updateOne({}, data);
  } else {
    await Contact.create(data);
  }
  revalidateTag("contact");
  return { success: true };
}
