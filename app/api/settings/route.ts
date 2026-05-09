import { verifyToken } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findById("global").lean();

    if (!settings) {
      console.log("[settings GET] No settings found, creating default document");
      try {
        const created = await SiteSettings.create({
          _id: "global",
          logoUrl: "",
          logoUrlLight: "",
          faviconUrl: "",
        });
        settings = created.toObject();
      } catch (createErr) {
        console.error("[settings GET] Failed to create default settings:", createErr);
      }
    }

    if (!settings) {
      console.warn("[settings GET] Still no settings after creation attempt");
      return NextResponse.json({ logoUrl: "", logoUrlLight: "", faviconUrl: "", fontSizes: {} });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[settings GET] Error:", err);
    return NextResponse.json({ logoUrl: "", logoUrlLight: "", faviconUrl: "", fontSizes: {} });
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

    const result = await SiteSettings.findByIdAndUpdate(
      "global",
      {
        $set: {
          logoUrl: data.logoUrl ?? "",
          logoUrlLight: data.logoUrlLight ?? "",
          faviconUrl: data.faviconUrl ?? "",
          fontSizes: data.fontSizes ?? {},
          socialTiktok: data.socialTiktok ?? "",
          socialFacebook: data.socialFacebook ?? "",
          socialInstagram: data.socialInstagram ?? "",
          tagline: data.tagline ?? "DOING WHAT MATTERS",
        },
      },
      { upsert: true, new: true }
    );

    if (!result) {
      console.warn("[settings PUT] Update returned null, document may not have been created");
    } else {
      console.log("[settings PUT] Successfully saved settings for logoUrl:", data.logoUrl?.slice(0, 50));
    }

    revalidateTag("site-settings");
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    console.error("[settings PUT] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to save settings: ${msg}` }, { status: 500 });
  }
}
