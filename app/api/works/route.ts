import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Work } from "@/models/Work";

export async function GET() {
  await dbConnect();
  const works = await Work.find().lean();
  return NextResponse.json(JSON.parse(JSON.stringify(works)));
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const raw = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...data } = raw;
    const work = await Work.create(data);
    return NextResponse.json(JSON.parse(JSON.stringify(work)));
  } catch (err) {
    console.error("POST /api/works error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
