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

    await authService.forgotPassword(parsed.data);
    
    return NextResponse.json({ success: true, message: "If that email exists, a password reset link has been sent." });
  } catch (error: any) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
