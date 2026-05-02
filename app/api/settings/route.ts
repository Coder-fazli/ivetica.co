import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findById("global").lean();
    return NextResponse.json(settings || { logoUrl: "", faviconUrl: "" });
  } catch {
    return NextResponse.json({ logoUrl: "", faviconUrl: "" });
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  await dbConnect();
  await SiteSettings.findByIdAndUpdate(
    "global",
    { $set: { logoUrl: data.logoUrl ?? "", faviconUrl: data.faviconUrl ?? "" } },
    { upsert: true, new: true }
  );
  revalidateTag("site-settings");
  return NextResponse.json({ ok: true });
}
