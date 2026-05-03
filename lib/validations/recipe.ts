import { z } from "zod";

export const createRecipeSchema = z.object({
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  category: z.string().min(1).trim(),

  servings: z.coerce.number().int().positive(),
  prepTime: z.coerce.number().int().nonnegative().optional(),
  cookTime: z.coerce.number().int().nonnegative().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
   visibility: z.enum(["public", "private"]).default("private"),

  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.coerce.number().positive(),
      unit: z.string().min(1),
    })
  ),
});
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
