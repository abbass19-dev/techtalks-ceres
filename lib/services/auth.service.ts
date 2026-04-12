import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { userRepository } from "@/lib/repositories/user.repository";
import type { SigninInput } from "@/lib/validations/auth";

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
};
