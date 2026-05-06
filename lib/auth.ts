import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function verifyAuth(req: NextRequest): Promise<string | null> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret";
    const encodedSecret = new TextEncoder().encode(JWT_SECRET);
    
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, encodedSecret);
    return (payload.userId as string) || null;
  } catch (error) {
    return null;
  }
}
