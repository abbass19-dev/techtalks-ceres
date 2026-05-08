import Recipe from "@/lib/models/Recipe";
import { connectToDatabase } from "@/lib/db";
import type { UpdateQuery } from "mongoose";
import type { IRecipe, IRecipeDocument } from "@/lib/models/Recipe";

export const recipeRepository = {
  async create(payload: Partial<IRecipe> & { userId: string }) {
    await connectToDatabase();
    return Recipe.create(payload);
  },

  async findAll() {
    await connectToDatabase();
    return Recipe.find({ visibility: "public", status: "published" })
      .select(
        "name imageUrl category servings prepTime cookTime nutritionPerServing totalNutrition visibility status userId",
      )
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  },

  async findById(id: string) {
    await connectToDatabase();
    return Recipe.findById(id).lean().exec();
  },

  async findPublicPublishedById(id: string) {
    await connectToDatabase();
    return Recipe.findOne({
      _id: id,
      visibility: "public",
      status: "published",
    })
      .lean()
      .exec();
  },

  async findAllByUserId(userId: string) {
    await connectToDatabase();
    return Recipe.find({ userId })
      .select(
        "name imageUrl category servings prepTime cookTime nutritionPerServing totalNutrition visibility status createdAt",
      )
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  },
  async update(id: string, updateData: UpdateQuery<IRecipeDocument>) {
  await connectToDatabase();
  return Recipe.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
},

async delete(id: string) {
  await connectToDatabase();
  return Recipe.findByIdAndDelete(id).exec();
},
async getRecipeByIdForUser(recipeId: string, userId: string) {
  try {
    const recipe = await recipeRepository.findById(recipeId);

    if (!recipe) {
      return { recipe: null, error: "Recipe not found" };
    }

    if (recipe.userId.toString() !== userId) {
      return { recipe: null, error: "Unauthorized" };
    }

    return { recipe, error: null };
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    return { recipe: null, error: "Failed to retrieve recipe" };
  }
},
};
