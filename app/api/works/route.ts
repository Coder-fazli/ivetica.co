import { verifyToken } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
  return !!verified;
}

export async function GET() {
  await dbConnect();
  const works = await Work.find().lean();
  return NextResponse.json(JSON.parse(JSON.stringify(works)));
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const raw = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...data } = raw;
    const work = await Work.create(data);
    revalidateTag("works");
    return NextResponse.json(JSON.parse(JSON.stringify(work)));
  } catch (err) {
    console.error("POST /api/works error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
