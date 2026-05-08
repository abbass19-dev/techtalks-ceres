import { z } from "zod";

export const SUPPORTED_RECIPE_UNITS = [
  "g",
  "kg",
  "tbsp",
  "tsp",
  "cup",
  "ml",
  "piece",
  "cloves",
] as const;

const optionalImageUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url("Must be a valid URL").optional(),
);

const recipeIngredientSchema = z.object({
  name: z.string().trim().min(1, "Ingredient name is required"),
  quantity: z.coerce.number().positive("Ingredient quantity must be positive"),
  unit: z.enum(SUPPORTED_RECIPE_UNITS, {
    message: "Unsupported ingredient unit",
  }),
});

const recipeInstructionSchema = z.object({
  step: z.coerce.number().int().positive(),
  title: z.string().trim().min(1, "Instruction title is required"),
  description: z.string().trim().min(1, "Instruction description is required"),
});

export const createRecipeSchema = z.object({
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  category: z.string().min(1).trim(),

  servings: z.coerce.number().int().positive(),
  prepTime: z.coerce.number().int().nonnegative().optional(),
  cookTime: z.coerce.number().int().nonnegative().optional(),
  imageUrl: optionalImageUrl,
  visibility: z.enum(["public", "private"]).default("private"),
  status: z.enum(["draft", "published"]).default("draft"),
  instructions: z.array(recipeInstructionSchema).min(1),
  ingredients: z.array(recipeIngredientSchema).min(1),
});

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  servings: z.coerce.number().int().positive().optional(),
  ingredients: z.array(recipeIngredientSchema).min(1).optional(),
  instructions: z.array(recipeInstructionSchema).min(1).optional(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
