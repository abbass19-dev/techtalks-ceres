import Ingredient from "@/lib/models/Ingredient";
import { recipeRepository } from "@/lib/repositories/recipe.repository";
import type { CreateRecipeInput } from "@/lib/validations/recipe";

const round = (num: number) => Number(Number(num || 0).toFixed(2));

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const convertToGrams = (name: string, quantity: number, unit: string) => {
  if (unit === "g") return quantity;
  if (unit === "kg") return quantity * 1000;

  if (unit === "tbsp") {
    if (name.toLowerCase().includes("olive oil")) return quantity * 13.5;
    if (name.toLowerCase().includes("lemon")) return quantity * 15;
    return quantity * 15;
  }

  if (unit === "cloves") {
    if (name.toLowerCase().includes("garlic")) return quantity * 3;
    return quantity * 5;
  }

  return quantity;
};

export const recipeService = {
  async addRecipe(input: CreateRecipeInput, userId: string) {
    try {
      let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        minerals: {
          calcium: 0,
          iron: 0,
          potassium: 0,
          magnesium: 0,
        },
        vitamins: {
          vitaminA: 0,
          vitaminB: 0,
          vitaminC: 0,
          vitaminD: 0,
          vitaminE: 0,
        },
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

        const grams = convertToGrams(item.name, Number(item.quantity), item.unit);
        const factor = grams / 100;
        const per100g = ingredient.per100g || {};

        const nutrients = {
          calories: round((per100g.calories || 0) * factor),
          protein: round((per100g.protein || 0) * factor),
          carbs: round((per100g.carbs || 0) * factor),
          fat: round((per100g.fat || 0) * factor),
        };

        const minerals = {
          calcium: round((per100g.calcium || 0) * factor),
          iron: round((per100g.iron || 0) * factor),
          potassium: round((per100g.potassium || 0) * factor),
          magnesium: round((per100g.magnesium || 0) * factor),
        };

        const vitamins = {
          vitaminA: round((per100g.vitaminA || 0) * factor),
          vitaminB: round((per100g.vitaminB || 0) * factor),
          vitaminC: round((per100g.vitaminC || 0) * factor),
          vitaminD: round((per100g.vitaminD || 0) * factor),
          vitaminE: round((per100g.vitaminE || 0) * factor),
        };

        totalNutrition = {
          calories: round(totalNutrition.calories + nutrients.calories),
          protein: round(totalNutrition.protein + nutrients.protein),
          carbs: round(totalNutrition.carbs + nutrients.carbs),
          fat: round(totalNutrition.fat + nutrients.fat),
          minerals: {
            calcium: round(totalNutrition.minerals.calcium + minerals.calcium),
            iron: round(totalNutrition.minerals.iron + minerals.iron),
            potassium: round(
              totalNutrition.minerals.potassium + minerals.potassium,
            ),
            magnesium: round(
              totalNutrition.minerals.magnesium + minerals.magnesium,
            ),
          },
          vitamins: {
            vitaminA: round(totalNutrition.vitamins.vitaminA + vitamins.vitaminA),
            vitaminB: round(totalNutrition.vitamins.vitaminB + vitamins.vitaminB),
            vitaminC: round(totalNutrition.vitamins.vitaminC + vitamins.vitaminC),
            vitaminD: round(totalNutrition.vitamins.vitaminD + vitamins.vitaminD),
            vitaminE: round(totalNutrition.vitamins.vitaminE + vitamins.vitaminE),
          },
        };

        calculatedIngredients.push({
          name: ingredient.name,
          inputName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          gramsUsed: grams,
          nutrients,
          minerals,
          vitamins,
        });
      }

      const newRecipe = await recipeRepository.create({
        ...input,
        userId,
        ingredients: calculatedIngredients,
        totalNutrition,
        nutritionPerServing: {
          calories: round(totalNutrition.calories / input.servings),
          protein: round(totalNutrition.protein / input.servings),
          carbs: round(totalNutrition.carbs / input.servings),
          fat: round(totalNutrition.fat / input.servings),
          minerals: {
            calcium: round(
              totalNutrition.minerals.calcium / input.servings,
            ),
            iron: round(totalNutrition.minerals.iron / input.servings),
            potassium: round(
              totalNutrition.minerals.potassium / input.servings,
            ),
            magnesium: round(
              totalNutrition.minerals.magnesium / input.servings,
            ),
          },
          vitamins: {
            vitaminA: round(totalNutrition.vitamins.vitaminA / input.servings),
            vitaminB: round(totalNutrition.vitamins.vitaminB / input.servings),
            vitaminC: round(totalNutrition.vitamins.vitaminC / input.servings),
            vitaminD: round(totalNutrition.vitamins.vitaminD / input.servings),
            vitaminE: round(totalNutrition.vitamins.vitaminE / input.servings),
          },
        },
      });

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