import { clerkClient, verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return false;
  const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
  return !!verified;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100, orderBy: "-created_at" });

  const mapped = users.map((u) => ({
    id: u.id,
    email: u.emailAddresses[0]?.emailAddress ?? "",
    firstName: u.firstName ?? "",
    lastName: u.lastName ?? "",
    imageUrl: u.imageUrl,
    createdAt: u.createdAt,
    lastSignInAt: u.lastSignInAt,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const client = await clerkClient();
  try {
    await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/sign-up`,
      notify: true,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to send invitation";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const token = req.cookies.get("__session")?.value!;
  const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
  if (verified.sub === userId) return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });

  const client = await clerkClient();
  await client.users.deleteUser(userId);
  return NextResponse.json({ ok: true });
}
