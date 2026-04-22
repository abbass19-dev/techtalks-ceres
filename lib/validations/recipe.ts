import { z } from "zod";

export const createRecipeSchema = z.object({
  name: z.string().min(1, { message: "Recipe name is required." }).trim(),
  description: z.string().min(1, { message: "Description is required." }).trim(),
  category: z.string().min(1, { message: "Category is required." }).trim(),
  servings: z.number().int().positive({ message: "Servings must be a positive integer." }),
  prepTime: z.number().int().nonnegative().optional(),
  cookTime: z.number().int().nonnegative().optional(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
