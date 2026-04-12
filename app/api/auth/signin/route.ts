import { NextResponse } from "next/server";
import { signinSchema } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const parsed = signinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const result = await authService.signin(parsed.data);

    if (result.error || !result.token) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: result.user });

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("SIGNIN_ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
