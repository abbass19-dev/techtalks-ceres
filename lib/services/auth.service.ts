import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import crypto from "crypto";
import { userRepository } from "@/lib/repositories/user.repository";
import { emailService } from "@/lib/services/email.service";
import type { SigninInput, ForgotPasswordInput, ResetPasswordInput } from "@/lib/validations/auth";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const authService = {

  async signin(input: SigninInput) {
    const { email, password } = input;
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      return { token: null, error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash as string);
    if (!isMatch) {
      return { token: null, error: "Invalid credentials" };
    }

    const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(encodedSecret);

    return {
      token,
      user: { id: user._id.toString(), email: user.email },
    };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      // Always return success to prevent email enumeration
      return { success: true };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await userRepository.updateUser(user._id.toString(), {
      resetPasswordToken: resetToken,
      resetPasswordExpires,
    });

    
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { success: true };
  },

  async resetPassword(input: ResetPasswordInput) {
    const user = await userRepository.findByResetToken(input.token);
    if (!user) {
      return { error: "Invalid or expired reset token." };
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await userRepository.updateUser(user._id.toString(), {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { success: true };
  },
};
