"use server";

import dbConnect from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { ServiceDetailType } from "@/types";

export async function getServices(): Promise<ServiceDetailType[]> {
  await dbConnect();
  const data = await Service.find().lean();
  return data as ServiceDetailType[];
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetailType | null> {
  await dbConnect();
  const data = await Service.findOne({ slug }).lean();
  return data as ServiceDetailType | null;
}
