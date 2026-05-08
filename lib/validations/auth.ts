import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const optionalPositiveNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().positive().optional(),
);
const optionalPositiveInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive().optional(),
);
const optionalGender = z.preprocess(
  emptyToUndefined,
  z.enum(["male", "female", "other"]).optional(),
);
const optionalActivityLevel = z.preprocess(
  emptyToUndefined,
  z.enum(["sedentary", "light", "moderate", "active"]).optional(),
);

export const signinSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});
export const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }).trim(),
  lastName: z.string().min(1, { message: "Last name is required." }).trim(),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .trim()
    .toLowerCase(),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
    .trim(),
  gender: optionalGender,
  age: optionalPositiveInt,
  height: optionalPositiveNumber,
  weight: optionalPositiveNumber,
  activityLevel: optionalActivityLevel,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, { message: "Token is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
