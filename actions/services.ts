"use server";

import dbConnect from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { ServiceDetailType } from "@/types";

export async function getServices(): Promise<ServiceDetailType[]> {
  await dbConnect();
  const data = await Service.find().lean();
  return JSON.parse(JSON.stringify(data)) as ServiceDetailType[];
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetailType | null> {
  await dbConnect();
  const data = await Service.findOne({ slug }).lean();
  return JSON.parse(JSON.stringify(data)) as ServiceDetailType | null;
}

export async function createService(data: Partial<ServiceDetailType>): Promise<{ success: boolean }> {
  await dbConnect();
  await Service.create(data);
  return { success: true };
}

export async function updateService(slug: string, data: Partial<ServiceDetailType>): Promise<{ success: boolean }> {
  await dbConnect();
  await Service.updateOne({ slug }, data);
  return { success: true };
}

export async function deleteService(slug: string): Promise<{ success: boolean }> {
  await dbConnect();
  await Service.deleteOne({ slug });
  return { success: true };
}
