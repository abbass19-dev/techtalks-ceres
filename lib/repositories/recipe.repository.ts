import Recipe, { IRecipe } from "@/lib/models/Recipe";
import { connectToDatabase } from "@/lib/db";

export const recipeRepository = {
  async create(payload: any) {
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

  async findAllByUserId(userId: string) {
    await connectToDatabase();
    return Recipe.find({ userId }).sort({ createdAt: -1 }).exec();
  },
};

