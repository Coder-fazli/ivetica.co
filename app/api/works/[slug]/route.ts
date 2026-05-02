import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";

function stripIds(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(stripIds);
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (k === "_id" || k === "__v") continue;
      result[k] = stripIds(v);
    }
    return result;
  }
  return obj;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const work = await Work.findOne({ slug }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(work)));
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    await dbConnect();
    const raw = await req.json();
    const data = stripIds(raw) as Record<string, unknown>;
    await Work.findOneAndUpdate({ slug }, { $set: data }, { new: true, runValidators: false });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PUT /api/works error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  await dbConnect();
  await Work.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
