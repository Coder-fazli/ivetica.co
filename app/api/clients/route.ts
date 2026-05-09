import { verifyToken } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { revalidateTag } from "next/cache";

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
  return !!verified;
}

export async function GET() {
  await dbConnect();
  const clients = await Client.find().sort({ name: 1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(clients)));
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { _id, __v, ...data } = await req.json();
    void _id; void __v;
    const client = await Client.create(data);
    revalidateTag("clients");
    return NextResponse.json(JSON.parse(JSON.stringify(client)));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create client";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const client = await Client.findByIdAndUpdate(id, data, { new: true });
    revalidateTag("clients");
    return NextResponse.json(JSON.parse(JSON.stringify(client)));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update client";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await dbConnect();
    await Client.findByIdAndDelete(id);
    revalidateTag("clients");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete client";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
