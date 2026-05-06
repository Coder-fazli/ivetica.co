import { verifyToken } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Tag } from "@/models/Tag";

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({}).sort({ name: 1 }).lean();
    return NextResponse.json(tags || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("__session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Tag name required" }, { status: 400 });
    }

    await dbConnect();
    const tag = await Tag.create({ name: name.trim() });
    return NextResponse.json(tag);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create tag";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("__session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "ID and name required" }, { status: 400 });
    }

    await dbConnect();
    const tag = await Tag.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
    return NextResponse.json(tag);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update tag";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("__session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await dbConnect();
    await Tag.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete tag";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
