import { NextRequest, NextResponse } from "next/server";
import SavedRecipe from "@/lib/models/SavedRecipe";
import { connectToDatabase } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const recipeId = body.recipeId;

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 },
      );
    }

    const existing = await SavedRecipe.findOne({
      userId,
      recipeId,
    }).lean();

    if (existing) {
      return NextResponse.json({ saved: existing });
    }

    const saved = await SavedRecipe.create({
      userId,
      recipeId,
    });

    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json({ saved: [] });
    }

    const saved = await SavedRecipe.find({ userId })
      .populate({
        path: "recipeId",
        match: { visibility: "public", status: "published" },
        select:
          "name imageUrl category servings prepTime cookTime nutritionPerServing totalNutrition user",
      })
      .lean();

    return NextResponse.json({
      saved: saved.filter((item) => item.recipeId),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}
