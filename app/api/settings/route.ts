import { verifyToken } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
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

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("__session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    await dbConnect();
    await SiteSettings.findByIdAndUpdate(
      "global",
      {
        $set: {
          logoUrl: data.logoUrl ?? "",
          logoUrlLight: data.logoUrlLight ?? "",
          faviconUrl: data.faviconUrl ?? "",
          fontSizes: data.fontSizes ?? {},
        },
      },
      { upsert: true, new: true }
    );
    revalidateTag("site-settings");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[settings PUT] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
