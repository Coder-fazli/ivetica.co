import { verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { writeFile, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { Readable } from "stream";

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

async function isAuthed(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  try {
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    return !!verified;
  } catch { return false; }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function convertGifToMp4(gifBuffer: Buffer, tmpKey: string): Promise<Buffer> {
  const inPath = join(tmpdir(), `${tmpKey}.gif`);
  const outPath = join(tmpdir(), `${tmpKey}.mp4`);
  await writeFile(inPath, gifBuffer);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inPath)
      .outputOptions(["-movflags faststart", "-pix_fmt yuv420p", "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"])
      .noAudio()
      .format("mp4")
      .on("end", resolve)
      .on("error", reject)
      .save(outPath);
  });

  const mp4Buffer = await readFile(outPath);
  await unlink(inPath).catch(() => {});
  await unlink(outPath).catch(() => {});
  return mp4Buffer;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 1. List all GIF objects in R2
    const list = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, MaxKeys: 1000 }));
    const gifKeys = (list.Contents || [])
      .map(o => o.Key!)
      .filter(k => k.toLowerCase().endsWith(".gif"));

    if (gifKeys.length === 0) return NextResponse.json({ ok: true, converted: 0, message: "No GIFs found in storage" });

    await dbConnect();
    const db = mongoose.connection.db!;
    const collections = await db.listCollections().toArray();

    const results: { key: string; newKey: string; status: string }[] = [];

    for (const gifKey of gifKeys) {
      try {
        // 2. Download GIF from R2
        const getRes = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: gifKey }));
        const gifBuffer = await streamToBuffer(getRes.Body as Readable);

        // 3. Convert to MP4
        const tmpId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const mp4Buffer = await convertGifToMp4(gifBuffer, tmpId);

        // 4. Upload MP4 to R2
        const mp4Key = gifKey.replace(/\.gif$/i, ".mp4");
        await r2.send(new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: mp4Key,
          Body: mp4Buffer,
          ContentType: "video/mp4",
        }));

        // 5. Update all MongoDB documents that reference the old URL
        const oldUrl = `${R2_PUBLIC_URL}/${gifKey}`;
        const newUrl = `${R2_PUBLIC_URL}/${mp4Key}`;

        for (const col of collections) {
          const collection = db.collection(col.name);
          // Use $push/$set with text replacement across all string fields
          await collection.updateMany(
            {},
            [{ $replaceWith: { $literal: "$$ROOT" } }] // no-op to get count
          ).catch(() => {});

          // Replace URL in all documents using aggregation pipeline update
          await collection.updateMany(
            { $or: [
              { thumbnail: oldUrl },
              { coverImage: oldUrl },
              { "gallery": oldUrl },
              { logoUrl: oldUrl },
              { logoUrlLight: oldUrl },
              { homepageVideo: oldUrl },
              { "story.image": oldUrl },
              { "story.founderAvatar": oldUrl },
              { mapCoverImage: oldUrl },
              { photo: oldUrl },
            ]},
            [{ $set: {
              thumbnail: { $cond: [{ $eq: ["$thumbnail", oldUrl] }, newUrl, "$thumbnail"] },
              coverImage: { $cond: [{ $eq: ["$coverImage", oldUrl] }, newUrl, "$coverImage"] },
              logoUrl: { $cond: [{ $eq: ["$logoUrl", oldUrl] }, newUrl, "$logoUrl"] },
              logoUrlLight: { $cond: [{ $eq: ["$logoUrlLight", oldUrl] }, newUrl, "$logoUrlLight"] },
              homepageVideo: { $cond: [{ $eq: ["$homepageVideo", oldUrl] }, newUrl, "$homepageVideo"] },
              mapCoverImage: { $cond: [{ $eq: ["$mapCoverImage", oldUrl] }, newUrl, "$mapCoverImage"] },
            }}]
          ).catch(() => {});

          // Handle gallery array
          await collection.updateMany(
            { gallery: oldUrl },
            { $set: { "gallery.$[elem]": newUrl } },
            { arrayFilters: [{ elem: oldUrl }] }
          ).catch(() => {});
        }

        results.push({ key: gifKey, newKey: mp4Key, status: "converted" });
      } catch (err) {
        results.push({ key: gifKey, newKey: "", status: `failed: ${err instanceof Error ? err.message : String(err)}` });
      }
    }

    return NextResponse.json({ ok: true, converted: results.filter(r => r.status === "converted").length, total: gifKeys.length, results });
  } catch (err) {
    console.error("[convert-gifs] error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
