"use server";

import dbConnect from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { unstable_cache, revalidateTag } from "next/cache";

export type ClientType = {
  _id?: string;
  name: string;
  tags: string[];
  createdAt?: string;
};

const getCachedClients = unstable_cache(
  async () => {
    await dbConnect();
    const data = await Client.find().sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(data)) as ClientType[];
  },
  ["all-clients"],
  { revalidate: 300, tags: ["clients"] }
);

export async function getClients(): Promise<ClientType[]> {
  return getCachedClients();
}

export async function createClient(data: Omit<ClientType, "_id" | "createdAt">): Promise<ClientType> {
  await dbConnect();
  const client = await Client.create(data);
  revalidateTag("clients");
  return JSON.parse(JSON.stringify(client));
}

export async function updateClient(id: string, data: Partial<ClientType>): Promise<{ success: boolean }> {
  await dbConnect();
  await Client.findByIdAndUpdate(id, data);
  revalidateTag("clients");
  return { success: true };
}

export async function deleteClient(id: string): Promise<{ success: boolean }> {
  await dbConnect();
  await Client.findByIdAndDelete(id);
  revalidateTag("clients");
  return { success: true };
}
