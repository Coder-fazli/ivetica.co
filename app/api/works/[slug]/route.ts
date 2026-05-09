import { verifyToken } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
  return !!verified;
}

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const work = await Work.findOne({ slug }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(work)));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  await dbConnect();
  await Work.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
