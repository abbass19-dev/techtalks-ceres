import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/repositories/user.repository";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or invalid token" }, { status: 401 });
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        imageUrl: user.imageUrl || "",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        weight: user.weight,
        height: user.height,
        age: user.age,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API_AUTH_ME_ERROR (GET):", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}