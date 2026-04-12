import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const result = await authService.signup(parsed.data);

    if (result.error || !result.token) {
      return NextResponse.json(
        { error: result.error || "Signup failed" },
        { status: result.error === "User already exists" ? 409 : 400 },
      );
    }

    const response = NextResponse.json(
      { success: true, user: result.user },
      { status: 201 },
    );
    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
