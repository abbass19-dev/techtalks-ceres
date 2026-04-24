import Ingredient from "@/lib/models/Ingredient";
import { recipeRepository } from "@/lib/repositories/recipe.repository";
import type { CreateRecipeInput } from "@/lib/validations/recipe";

const round = (num: number) => Number(Number(num || 0).toFixed(2));

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const recipeService = {
  async addRecipe(input: CreateRecipeInput, userId: string) {
    try {
      let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      const calculatedIngredients = [];

      for (const item of input.ingredients) {
        const searchText = item.name.trim();
        const safeSearch = escapeRegex(searchText);

        const ingredient = await Ingredient.findOne({
          $or: [
            { name: { $regex: safeSearch, $options: "i" } },
            { aliases: { $elemMatch: { $regex: safeSearch, $options: "i" } } },
          ],
        });

        if (!ingredient) {
          return { recipe: null, error: `${item.name} not found` };
        }

        const grams = Number(item.quantity);
        const factor = grams / 100;

        const nutrients = {
          calories: round((ingredient.per100g?.calories || 0) * factor),
          protein: round((ingredient.per100g?.protein || 0) * factor),
          carbs: round((ingredient.per100g?.carbs || 0) * factor),
          fat: round((ingredient.per100g?.fat || 0) * factor),
        };

        totalNutrition = {
          calories: round(totalNutrition.calories + nutrients.calories),
          protein: round(totalNutrition.protein + nutrients.protein),
          carbs: round(totalNutrition.carbs + nutrients.carbs),
          fat: round(totalNutrition.fat + nutrients.fat),
        };

        calculatedIngredients.push({
          name: ingredient.name,
          inputName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          gramsUsed: grams,
          nutrients,
        });
      }

      const newRecipe = await recipeRepository.create({
        ...input,
        userId,
        ingredients: calculatedIngredients,
        totalNutrition,
      } as any);
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
