import { verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function isAuthed(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  try {
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    return !!verified;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [images, videos] = await Promise.all([
    cloudinary.api.resources({ resource_type: "image", prefix: "lvetica", type: "upload", max_results: 200 }),
    cloudinary.api.resources({ resource_type: "video", prefix: "lvetica", type: "upload", max_results: 200 }),
  ]);

  const all = [
    ...videos.resources.map((r: Record<string, string | number>) => ({ url: r.secure_url, publicId: r.public_id, kind: "video", bytes: r.bytes, createdAt: r.created_at })),
    ...images.resources.map((r: Record<string, string | number>) => ({ url: r.secure_url, publicId: r.public_id, kind: "image", bytes: r.bytes, createdAt: r.created_at })),
  ];

  return NextResponse.json(all);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthed(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { publicId, kind } = await req.json();
  await cloudinary.uploader.destroy(publicId, { resource_type: kind === "video" ? "video" : "image" });
  return NextResponse.json({ ok: true });
}
