import { recipeRepository } from "@/lib/repositories/recipe.repository";
import type { CreateRecipeInput } from "@/lib/validations/recipe";

export const recipeService = {
  async addRecipe(input: CreateRecipeInput, userId: string) {
    try {
      const newRecipe = await recipeRepository.create({ ...input, userId });
      return { recipe: newRecipe, error: null };
    } catch (error) {
      console.error("Error adding recipe:", error);
      return { recipe: null, error: "Failed to create recipe" };
    }
  },

  async getAllRecipes() {
    try {
      const recipes = await recipeRepository.findAll();
      return { recipes, error: null };
    } catch (error) {
      console.error("Error retrieving recipes:", error);
      return { recipes: null, error: "Failed to retrieve recipes" };
    }
  },

  async getRecipesByUser(userId: string) {
    try {
      const recipes = await recipeRepository.findAllByUserId(userId);
      return { recipes, error: null };
    } catch (error) {
      console.error("Error retrieving user recipes:", error);
      return { recipes: null, error: "Failed to retrieve recipes" };
    }
  },
};
