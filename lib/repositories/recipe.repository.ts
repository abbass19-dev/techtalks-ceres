import Recipe, { IRecipe } from "@/lib/models/Recipe";
import { connectToDatabase } from "@/lib/db";

export const recipeRepository = {
  async create(payload: IRecipe) {
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

