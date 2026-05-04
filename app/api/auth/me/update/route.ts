import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/user.service";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or invalid token" }, { status: 401 });
    }

    const body = await req.json();
    
    const updatedUser = await userService.updateProfile(userId, body);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        weight: updatedUser.weight,
        height: updatedUser.height,
        age: updatedUser.age,
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.format() }, { status: 400 });
    }
    if (error instanceof Error) {
      console.error("API_AUTH_PROFILE_ERROR (PATCH):", error.message);
      if (error.message === "User not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
