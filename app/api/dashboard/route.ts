import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db";
import WeeklyPlanner from "@/lib/models/WeeklyPlanner";
import Recipe from "@/lib/models/Recipe";
import { Types } from "mongoose";
import { calculateNutrientPercentages } from "@/lib/utils/nutrientCalculator";
import { NutritionTotals, UserNutrientTotals } from "@/lib/utils/Types";
const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, encodedSecret);
    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "week";

    const planner = await WeeklyPlanner.findOne({ userId }).lean();

    const schedule = planner?.schedule || {};

    const recipeIds = Object.values(schedule)
      .flat()
      .filter((id): id is string => Types.ObjectId.isValid(String(id)));

    const recipes = await Recipe.find({
      _id: { $in: recipeIds },
      $or: [
        { userId },
        { visibility: "public", status: "published" },
      ],
    }).lean();

    type PlannerRecipe = {
      _id: { toString(): string };
      servings?: number;
      nutritionPerServing?: NutritionTotals;
      totalNutrition?: NutritionTotals;
    };

    const perServing = (recipe: PlannerRecipe, key: keyof NutritionTotals) => {
      const direct = recipe.nutritionPerServing?.[key];
      if (typeof direct === "number") return direct;
      const total = recipe.totalNutrition?.[key];
      return typeof total === "number" ? total / (recipe.servings || 1) : 0;
    };

    const nestedPerServing = (
      recipe: PlannerRecipe,
      group: "minerals" | "vitamins",
      key: string,
    ) => {
      const direct = recipe.nutritionPerServing?.[group]?.[
        key as keyof NonNullable<NutritionTotals[typeof group]>
      ];
      if (typeof direct === "number") return direct;
      const total = recipe.totalNutrition?.[group]?.[
        key as keyof NonNullable<NutritionTotals[typeof group]>
      ];
      return typeof total === "number" ? total / (recipe.servings || 1) : 0;
    };

    const totals = recipeIds.reduce(
      (acc, id) => {
        const recipe = (recipes as PlannerRecipe[]).find(
          (r) => r._id.toString() === id.toString(),
        );
        if (!recipe) return acc;

        acc.calories += perServing(recipe, "calories");
        acc.protein += perServing(recipe, "protein");
        acc.carbs += perServing(recipe, "carbs");
        acc.fat += perServing(recipe, "fat");
        acc.minerals.calcium += nestedPerServing(recipe, "minerals", "calcium");
        acc.minerals.iron += nestedPerServing(recipe, "minerals", "iron");
        acc.minerals.potassium += nestedPerServing(
          recipe,
          "minerals",
          "potassium",
        );
        acc.minerals.magnesium += nestedPerServing(
          recipe,
          "minerals",
          "magnesium",
        );
        acc.vitamins.vitaminA += nestedPerServing(recipe, "vitamins", "vitaminA");
        acc.vitamins.vitaminB += nestedPerServing(recipe, "vitamins", "vitaminB");
        acc.vitamins.vitaminC += nestedPerServing(recipe, "vitamins", "vitaminC");
        acc.vitamins.vitaminD += nestedPerServing(recipe, "vitamins", "vitaminD");
        acc.vitamins.vitaminE += nestedPerServing(recipe, "vitamins", "vitaminE");

        return acc;
      },
      {
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
      },
    );

    totals.calories = Math.round(totals.calories);
    totals.protein = Math.round(totals.protein);
    totals.carbs = Math.round(totals.carbs);
    totals.fat = Math.round(totals.fat);

    // Calculate nutrient percentages based on RDI × period days
    const days = period === "month" ? 30 : 7;
    const nutrientTotals: UserNutrientTotals = {
      minerals: totals.minerals,
      vitamins: totals.vitamins,
    };
    const nutrientPercentages = calculateNutrientPercentages(nutrientTotals, undefined, days);

    return NextResponse.json({
      totals,
      nutrientPercentages,
      recipes,
      planner,
      period,
    });
  } catch (error) {
    console.error("Dashboard planner error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
