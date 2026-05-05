import { verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";

async function isAuthed(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  try {
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    return !!verified;
  } catch { return false; }
}

const VIDEO_EXT = new Set(["mp4", "mov", "webm", "avi", "mkv", "m4v"]);
const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "ico"]);

export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, MaxKeys: 1000 }));
    const items = (result.Contents || []).map(obj => {
      const key = obj.Key!;
      const ext = key.split(".").pop()?.toLowerCase() || "";
      const kind: "image" | "video" | "other" =
        VIDEO_EXT.has(ext) ? "video" : IMAGE_EXT.has(ext) ? "image" : "other";
      return {
        url: `${R2_PUBLIC_URL}/${key}`,
        publicId: key,
        kind,
        bytes: obj.Size || 0,
        createdAt: obj.LastModified?.toISOString() || "",
      };
    }).filter(i => i.kind !== "other").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json(items);
  } catch (err) {
    console.error("[r2-media GET] error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { publicId } = await req.json();
    if (!publicId) return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: publicId }));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[r2-media DELETE] error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
