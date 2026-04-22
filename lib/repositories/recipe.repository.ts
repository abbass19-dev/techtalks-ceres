import { Recipe } from "@/lib/models/Recipe";
import { connectToDatabase } from "@/lib/db";
import type { CreateRecipeInput } from "@/lib/validations/recipe";

export const recipeRepository = {
  async create(payload: CreateRecipeInput) {
    await connectToDatabase();
    return Recipe.create(payload);
  },

  async findAll() {
    await connectToDatabase();
    return Recipe.find().sort({ createdAt: -1 }).exec();
  },

  async findById(id: string) {
    await connectToDatabase();
    return Recipe.findById(id).exec();
  },
};
