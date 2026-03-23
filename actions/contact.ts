"use server";

import dbConnect from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export type ContactData = {
  email: string;
  phone: string;
  location: string;
  mapEmbed: string;
};

const DEFAULTS: ContactData = {
  email:    "hello@lvetica.co",
  phone:    "+1 514 000 0000",
  location: "Montreal, Canada",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1396.5769090312324!2d-73.6519672!3d45.5673453!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91f8abc30e0ff%3A0xfc6d9cbb49022e9c!2sManoir%20Saint-Joseph!5e0!3m2!1sen!2sua!4v1685485811069!5m2!1sen!2sua",
};

export async function getContact(): Promise<ContactData> {
  await dbConnect();
  const data = await Contact.findOne().lean();
  return data ? JSON.parse(JSON.stringify(data)) : DEFAULTS;
}

export async function updateContact(data: ContactData): Promise<{ success: boolean }> {
  await dbConnect();
  const existing = await Contact.findOne();
  if (existing) {
    await Contact.updateOne({}, data);
  } else {
    await Contact.create(data);
  }
  return { success: true };
}
