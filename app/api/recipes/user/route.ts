import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { recipeService } from "@/lib/services/recipe.service";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized or invalid token" },
        { status: 401 },
      );
    }

    const { recipes, error } = await recipeService.getRecipesByUser(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ recipes: recipes || [] }, { status: 200 });
  } catch (error) {
    console.error("Recipe GET current user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
