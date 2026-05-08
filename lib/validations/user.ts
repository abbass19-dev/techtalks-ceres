import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const optionalPositiveNumber = (message: string) =>
  z.preprocess(emptyToUndefined, z.coerce.number().positive(message).optional());
const optionalPositiveInt = (message: string) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive(message).optional(),
  );

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name cannot be empty").optional(),
  lastName: z.string().trim().min(1, "Last name cannot be empty").optional(),
  phoneNumber: z.string().trim().min(1, "Phone number cannot be empty").optional(),
  gender: z.preprocess(
    emptyToUndefined,
    z.enum(["male", "female", "other"]).optional(),
  ),
  activityLevel: z.preprocess(
    emptyToUndefined,
    z.enum(["sedentary", "light", "moderate", "active"]).optional(),
  ),
  weight: optionalPositiveNumber("Weight must be positive"),
  height: optionalPositiveNumber("Height must be positive"),
  age: optionalPositiveInt("Age must be positive"),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
