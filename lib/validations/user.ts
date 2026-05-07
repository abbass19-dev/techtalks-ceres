import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name cannot be empty").optional(),
  lastName: z.string().trim().min(1, "Last name cannot be empty").optional(),
  phoneNumber: z.string().trim().min(1, "Phone number cannot be empty").optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  height: z.number().positive("Height must be positive").optional(),
  age: z.number().int().positive("Age must be positive").optional(),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
