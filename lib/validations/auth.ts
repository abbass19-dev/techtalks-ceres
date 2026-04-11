import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).trim().toLowerCase(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export type SigninInput = z.infer<typeof signinSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, { message: "Token is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
