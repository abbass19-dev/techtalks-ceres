import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SignJWT } from "jose";
import { userRepository } from "@/lib/repositories/user.repository";
import { sendResetPasswordEmail } from "@/lib/services/email.service";
import type {
  SigninInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/lib/validations/auth";

const JWT_SECRET = process.env.JWT_SECRET!;
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

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(encodedSecret);

    return {
      token,
      user: { id: user._id.toString(), email: user.email },
    };
  },

  async signup(input: SignupInput) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
      age,
      height,
      weight,
      activityLevel,
    } = input;
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return { token: null, error: "User already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      phoneNumber,
      gender,
      age,
      height,
      weight,
      activityLevel,
    });

    const token = await new SignJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(encodedSecret);

    return {
      token,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        gender: newUser.gender,
        age: newUser.age,
        height: newUser.height,
        weight: newUser.weight,
        activityLevel: newUser.activityLevel,
      },
    };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      return { success: true };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.updateUser(user._id.toString(), {
      resetPasswordToken: resetToken,
      resetPasswordExpires,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is not configured");
    }

    const resetLink = `${appUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(resetToken)}`;
    const emailResult = await sendResetPasswordEmail(
      user.email,
      resetLink,
      user.firstName,
    );

    return {
      success: true,
      debugLink: emailResult.sent ? undefined : resetLink,
      emailError: emailResult.sent ? undefined : emailResult.error,
    };
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
