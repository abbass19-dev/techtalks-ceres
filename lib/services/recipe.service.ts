import Ingredient from "@/lib/models/Ingredient";
import { recipeRepository } from "@/lib/repositories/recipe.repository";
import type {
  CreateRecipeInput,
  UpdateRecipeInput,
} from "@/lib/validations/recipe";
import { SUPPORTED_RECIPE_UNITS } from "@/lib/validations/recipe";

type NutrientGroup = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MineralGroup = {
  calcium: number;
  iron: number;
  potassium: number;
  magnesium: number;
};

type VitaminGroup = {
  vitaminA: number;
  vitaminB: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
};

type NutritionTotals = NutrientGroup & {
  minerals: MineralGroup;
  vitamins: VitaminGroup;
};

type IngredientRecord = {
  name: string;
  aliases?: string[];
  category?: string;
  per100g?: Partial<NutrientGroup & MineralGroup & VitaminGroup>;
};

type CalculatedIngredient = {
  name: string;
  quantity: number;
  unit: string;
  gramsUsed: number;
  nutrients: NutrientGroup;
  minerals: MineralGroup;
  vitamins: VitaminGroup;
};

type RecipeNutritionPayload = {
  ingredients: CalculatedIngredient[];
  totalNutrition: NutritionTotals;
  nutritionPerServing: NutritionTotals;
};

type RecipeUpdatePayload = Partial<
  Omit<CreateRecipeInput, "ingredients" | "servings"> & {
    servings: number;
    imageUrl: string;
  }
> &
  Partial<RecipeNutritionPayload>;

const supportedUnits = new Set<string>(SUPPORTED_RECIPE_UNITS);

const emptyTotals = (): NutritionTotals => ({
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
});

const round = (num: number) => Number(Number(num || 0).toFixed(2));

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getIngredientMatch = async (name: string) => {
  const trimmedName = name.trim();
  const safeName = escapeRegex(trimmedName);
  const exactRegex = new RegExp(`^${safeName}$`, "i");

  const exactNameMatches = await Ingredient.find({ name: exactRegex })
    .limit(2)
    .lean<IngredientRecord[]>()
    .exec();
  if (exactNameMatches.length === 1) {
    return { ingredient: exactNameMatches[0], error: null };
  }
  if (exactNameMatches.length > 1) {
    return {
      ingredient: null,
      error: `${trimmedName} has duplicate records in ingredient database. Please clean duplicate ingredients before using it.`,
    };
  }

  const exactAliasMatches = await Ingredient.find({ aliases: exactRegex })
    .limit(2)
    .lean<IngredientRecord[]>()
    .exec();
  if (exactAliasMatches.length === 1) {
    return { ingredient: exactAliasMatches[0], error: null };
  }
  if (exactAliasMatches.length > 1) {
    return {
      ingredient: null,
      error: `${trimmedName} has duplicate alias matches in ingredient database. Please choose or clean one ingredient record.`,
    };
  }

  if (trimmedName.length < 3) {
    return {
      ingredient: null,
      error: `${trimmedName} not found in ingredient database`,
    };
  }

  const partialRegex = new RegExp(safeName, "i");
  const partialMatches = await Ingredient.find({
    $or: [{ name: partialRegex }, { aliases: partialRegex }],
  })
    .limit(2)
    .lean<IngredientRecord[]>()
    .exec();

  if (partialMatches.length === 1) {
    return { ingredient: partialMatches[0], error: null };
  }

  if (partialMatches.length > 1) {
    return {
      ingredient: null,
      error: `${trimmedName} matches multiple ingredients. Please choose a database suggestion.`,
    };
  }

  return {
    ingredient: null,
    error: `${trimmedName} not found in ingredient database`,
  };
};

const convertToGrams = (
  ingredient: IngredientRecord,
  quantity: number,
  unit: string,
) => {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { grams: 0, error: "Ingredient quantity must be positive" };
  }

  if (!supportedUnits.has(unit)) {
    return { grams: 0, error: `Unsupported unit "${unit}"` };
  }

  const name = ingredient.name.toLowerCase();

  if (unit === "g") return { grams: quantity, error: null };
  if (unit === "kg") return { grams: quantity * 1000, error: null };

  if (name.includes("olive oil")) {
    if (unit === "tbsp") return { grams: quantity * 13.5, error: null };
    if (unit === "tsp") return { grams: quantity * 4.5, error: null };
    if (unit === "cup") return { grams: quantity * 216, error: null };
    if (unit === "ml") return { grams: quantity * 0.91, error: null };
  }

  if (name.includes("garlic") && unit === "cloves") {
    return { grams: quantity * 3, error: null };
  }

  const genericConversion: Record<string, number> = {
    tbsp: 15,
    tsp: 5,
    cup: 240,
    ml: 1,
    piece: 100,
    cloves: 5,
  };

  return { grams: quantity * genericConversion[unit], error: null };
};

const calculatePerServing = (
  totalNutrition: NutritionTotals,
  servings: number,
): NutritionTotals => ({
  calories: round(totalNutrition.calories / servings),
  protein: round(totalNutrition.protein / servings),
  carbs: round(totalNutrition.carbs / servings),
  fat: round(totalNutrition.fat / servings),
  minerals: {
    calcium: round(totalNutrition.minerals.calcium / servings),
    iron: round(totalNutrition.minerals.iron / servings),
    potassium: round(totalNutrition.minerals.potassium / servings),
    magnesium: round(totalNutrition.minerals.magnesium / servings),
  },
  vitamins: {
    vitaminA: round(totalNutrition.vitamins.vitaminA / servings),
    vitaminB: round(totalNutrition.vitamins.vitaminB / servings),
    vitaminC: round(totalNutrition.vitamins.vitaminC / servings),
    vitaminD: round(totalNutrition.vitamins.vitaminD / servings),
    vitaminE: round(totalNutrition.vitamins.vitaminE / servings),
  },
});

const calculateRecipeNutrition = async (
  ingredients: CreateRecipeInput["ingredients"],
  servings: number,
) => {
  if (!Number.isInteger(servings) || servings <= 0) {
    return { nutritionPayload: null, error: "Servings must be a positive number" };
  }

  const totalNutrition = emptyTotals();
  const calculatedIngredients: CalculatedIngredient[] = [];

  for (const item of ingredients) {
    const searchText = item.name.trim();
    if (!searchText) {
      return { nutritionPayload: null, error: "Ingredient name is required" };
    }

    const { ingredient, error: lookupError } = await getIngredientMatch(searchText);
    if (lookupError || !ingredient) {
      return { nutritionPayload: null, error: lookupError };
    }

    const { grams, error: conversionError } = convertToGrams(
      ingredient,
      Number(item.quantity),
      item.unit,
    );
    if (conversionError) {
      return {
        nutritionPayload: null,
        error: `${ingredient.name}: ${conversionError}`,
      };
    }

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

    totalNutrition.calories = round(totalNutrition.calories + nutrients.calories);
    totalNutrition.protein = round(totalNutrition.protein + nutrients.protein);
    totalNutrition.carbs = round(totalNutrition.carbs + nutrients.carbs);
    totalNutrition.fat = round(totalNutrition.fat + nutrients.fat);
    totalNutrition.minerals.calcium = round(
      totalNutrition.minerals.calcium + minerals.calcium,
    );
    totalNutrition.minerals.iron = round(totalNutrition.minerals.iron + minerals.iron);
    totalNutrition.minerals.potassium = round(
      totalNutrition.minerals.potassium + minerals.potassium,
    );
    totalNutrition.minerals.magnesium = round(
      totalNutrition.minerals.magnesium + minerals.magnesium,
    );
    totalNutrition.vitamins.vitaminA = round(
      totalNutrition.vitamins.vitaminA + vitamins.vitaminA,
    );
    totalNutrition.vitamins.vitaminB = round(
      totalNutrition.vitamins.vitaminB + vitamins.vitaminB,
    );
    totalNutrition.vitamins.vitaminC = round(
      totalNutrition.vitamins.vitaminC + vitamins.vitaminC,
    );
    totalNutrition.vitamins.vitaminD = round(
      totalNutrition.vitamins.vitaminD + vitamins.vitaminD,
    );
    totalNutrition.vitamins.vitaminE = round(
      totalNutrition.vitamins.vitaminE + vitamins.vitaminE,
    );

    calculatedIngredients.push({
      name: ingredient.name,
      quantity: item.quantity,
      unit: item.unit,
      gramsUsed: round(grams),
      nutrients,
      minerals,
      vitamins,
    });
  }

  return {
    nutritionPayload: {
      ingredients: calculatedIngredients,
      totalNutrition,
      nutritionPerServing: calculatePerServing(totalNutrition, servings),
    },
    error: null,
  };
};

const setIfDefined = <T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined,
) => {
  if (value !== undefined) {
    target[key] = value;
  }
};

export const recipeService = {
  async addRecipe(input: CreateRecipeInput, userId: string) {
    try {
      const { nutritionPayload, error } = await calculateRecipeNutrition(
        input.ingredients,
        input.servings,
      );

      if (error || !nutritionPayload) {
        return { recipe: null, error };
      }

      const newRecipe = await recipeRepository.create({
        ...input,
        userId,
        ...nutritionPayload,
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

  async getRecipeByIdForViewer(recipeId: string, userId: string | null) {
    try {
      if (userId) {
        const ownedRecipe = await recipeRepository.findById(recipeId);
        if (ownedRecipe?.userId?.toString() === userId) {
          return { recipe: ownedRecipe, error: null };
        }
      }

      const publicRecipe = await recipeRepository.findPublicPublishedById(recipeId);
      if (!publicRecipe) {
        return { recipe: null, error: "Recipe not found" };
      }

      return { recipe: publicRecipe, error: null };
    } catch (error) {
      console.error("Error retrieving recipe:", error);
      return { recipe: null, error: "Failed to retrieve recipe" };
    }
  },

  async getRecipeByIdForUser(recipeId: string, userId: string) {
    return recipeRepository.getRecipeByIdForUser(recipeId, userId);
  },

  async updateRecipeByUser(
    recipeId: string,
    userId: string,
    data: UpdateRecipeInput,
  ) {
    try {
      const existingRecipe = await recipeRepository.findById(recipeId);

      if (!existingRecipe) {
        return { recipe: null, error: "Recipe not found" };
      }

      if (existingRecipe.userId.toString() !== userId) {
        return { recipe: null, error: "Unauthorized" };
      }

      const updateData: RecipeUpdatePayload = {};
      setIfDefined(updateData, "name", data.name);
      setIfDefined(updateData, "description", data.description);
      setIfDefined(updateData, "category", data.category);
      setIfDefined(updateData, "prepTime", data.prepTime);
      setIfDefined(updateData, "cookTime", data.cookTime);
      setIfDefined(updateData, "visibility", data.visibility);
      setIfDefined(updateData, "status", data.status);
      setIfDefined(updateData, "instructions", data.instructions);

      if (data.imageUrl !== undefined) {
        updateData.imageUrl = data.imageUrl;
      }

      const servings =
        data.servings !== undefined
          ? Number(data.servings)
          : Number(existingRecipe.servings);
      updateData.servings = servings;

      if (Array.isArray(data.ingredients)) {
        const { nutritionPayload, error } = await calculateRecipeNutrition(
          data.ingredients,
          servings,
        );

        if (error || !nutritionPayload) {
          return { recipe: null, error };
        }

        Object.assign(updateData, nutritionPayload);
      }

      const updatedRecipe = await recipeRepository.update(recipeId, updateData);

      return { recipe: updatedRecipe, error: null };
    } catch (error) {
      console.error("Error updating recipe:", error);
      return { recipe: null, error: "Failed to update recipe" };
    }
  },

  async deleteRecipeByUser(recipeId: string, userId: string) {
    try {
      const existingRecipe = await recipeRepository.findById(recipeId);

      if (!existingRecipe) {
        return { success: false, error: "Recipe not found" };
      }

      if (existingRecipe.userId.toString() !== userId) {
        return { success: false, error: "Unauthorized" };
      }

      await recipeRepository.delete(recipeId);

      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return { success: false, error: "Failed to delete recipe" };
    }
  },
};
