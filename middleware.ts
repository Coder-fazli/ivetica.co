import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    if (isAdminRoute(req)) {
      await auth.protect();
    }
  } catch {
    // If Clerk is misconfigured (e.g. domain not whitelisted), redirect to sign-in
    // instead of crashing the whole server
    if (isAdminRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?|ttf)).*)"],
};
