import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isProtectedApi = req.nextUrl.pathname.startsWith("/api/protected");

  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    await jwtVerify(token, encodedSecret);
    return NextResponse.next();
  } catch (error: unknown) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
