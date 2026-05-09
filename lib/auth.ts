import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function verifyAuth(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, encodedSecret);
    return (payload.userId as string) || null;
  } catch {
    return null;
  }
}
