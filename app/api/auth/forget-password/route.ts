import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    const result = await authService.forgotPassword(parsed.data);
    const responseBody: { success: true; message: string; debugLink?: string; emailError?: string } = {
      success: true,
      message: "If that email exists, a password reset link has been sent.",
    };

    if (result.debugLink) {
      responseBody.debugLink = result.debugLink;
    }
    if (result.emailError) {
      responseBody.emailError = result.emailError;
    }

    return NextResponse.json(responseBody);
  } catch (error: unknown) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
