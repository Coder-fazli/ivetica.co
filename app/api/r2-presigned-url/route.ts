import { verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("__session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { filename, contentType } = await req.json();
    if (!filename || !contentType) return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });

    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml", "video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
    if (!ALLOWED.includes(contentType)) return NextResponse.json({ error: "File type not allowed" }, { status: 400 });

    const ext = filename.split(".").pop() || "bin";
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("[r2-presigned-url] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
