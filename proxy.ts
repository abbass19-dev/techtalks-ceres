import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
//hi
const JWT_SECRET = process.env.JWT_SECRET as string;
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/forget-password",
    "/reset-password",
  ];

  const publicApiPaths = [
    "/api/auth/logout",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/forget-password",
    "/api/auth/reset-password",
  ];

  const isPublicPath = publicPaths.includes(pathname);
  const isApi = pathname.startsWith("/api");
  const isPublicApi = publicApiPaths.includes(pathname);

  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".");

  let isValidToken = false;

  if (token) {
    try {
      await jwtVerify(token, encodedSecret);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  if (isApi && !isPublicApi && !isValidToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isValidToken && isPublicPath) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isValidToken && !isPublicPath && !isAsset && !isApi) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};