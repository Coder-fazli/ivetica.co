import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const type = form.get("type") as string | null;

    if (!file || !type) return NextResponse.json({ error: "Missing file or type" }, { status: 400 });
    if (!["logo", "favicon"].includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "png";
    const filename = type === "logo" ? `site-logo.${ext}` : `site-favicon.${ext}`;
    const publicDir = path.join(process.cwd(), "public");
    const dest = path.join(publicDir, filename);

    await mkdir(publicDir, { recursive: true });
    await writeFile(dest, buffer);
    return NextResponse.json({ url: `/${filename}?t=${Date.now()}` });
  } catch (err) {
    console.error("[upload] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
