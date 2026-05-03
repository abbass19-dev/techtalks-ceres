import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db";
import WeeklyPlanner from "@/lib/models/WeeklyPlanner";
import Recipe from "@/lib/models/Recipe";
import { Types } from "mongoose";
import { calculateNutrientPercentages } from "@/lib/utils/nutrientCalculator";
import { UserNutrientTotals } from "@/lib/utils/Types";
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
    }).lean();

    const totals = recipeIds.reduce(
      (acc, id) => {
        const recipe: any = recipes.find(
          (r) => r._id.toString() === id.toString(),
        );
        if (!recipe) return acc;

        acc.calories +=
          recipe.nutritionPerServing?.calories ||
          (recipe.totalNutrition?.calories || 0) / (recipe.servings || 1);
        acc.protein +=
          recipe.nutritionPerServing?.protein ||
          (recipe.totalNutrition?.protein || 0) / (recipe.servings || 1);
        acc.carbs +=
          recipe.nutritionPerServing?.carbs ||
          (recipe.totalNutrition?.carbs || 0) / (recipe.servings || 1);
        acc.fat +=
          recipe.nutritionPerServing?.fat ||
          (recipe.totalNutrition?.fat || 0) / (recipe.servings || 1);

        // Add minerals
        acc.minerals.calcium +=
          recipe.nutritionPerServing?.minerals?.calcium ||
          (recipe.totalNutrition?.minerals?.calcium || 0) /
            (recipe.servings || 1);
        acc.minerals.iron +=
          recipe.nutritionPerServing?.minerals?.iron ||
          (recipe.totalNutrition?.minerals?.iron || 0) / (recipe.servings || 1);
        acc.minerals.potassium +=
          recipe.nutritionPerServing?.minerals?.potassium ||
          (recipe.totalNutrition?.minerals?.potassium || 0) /
            (recipe.servings || 1);
        acc.minerals.magnesium +=
          recipe.nutritionPerServing?.minerals?.magnesium ||
          (recipe.totalNutrition?.minerals?.magnesium || 0) /
            (recipe.servings || 1);

        // Add vitamins
        acc.vitamins.vitaminA +=
          recipe.nutritionPerServing?.vitamins?.vitaminA ||
          (recipe.totalNutrition?.vitamins?.vitaminA || 0) /
            (recipe.servings || 1);
        acc.vitamins.vitaminB +=
          recipe.nutritionPerServing?.vitamins?.vitaminB ||
          (recipe.totalNutrition?.vitamins?.vitaminB || 0) /
            (recipe.servings || 1);
        acc.vitamins.vitaminC +=
          recipe.nutritionPerServing?.vitamins?.vitaminC ||
          (recipe.totalNutrition?.vitamins?.vitaminC || 0) /
            (recipe.servings || 1);
        acc.vitamins.vitaminD +=
          recipe.nutritionPerServing?.vitamins?.vitaminD ||
          (recipe.totalNutrition?.vitamins?.vitaminD || 0) /
            (recipe.servings || 1);
        acc.vitamins.vitaminE +=
          recipe.nutritionPerServing?.vitamins?.vitaminE ||
          (recipe.totalNutrition?.vitamins?.vitaminE || 0) /
            (recipe.servings || 1);

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
