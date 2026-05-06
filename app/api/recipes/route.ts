import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { recipeService } from "@/lib/services/recipe.service";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const userOnly = searchParams.get("userOnly") === "true";

    if (userOnly) {
      const userId = await verifyAuth(req);
      if (userId) {
        const { recipes, error } = await recipeService.getRecipesByUser(userId);
        if (error) {
          return NextResponse.json({ error }, { status: 500 });
        }
        return NextResponse.json({ recipes });
      }
    }

    const { recipes, error } = await recipeService.getAllRecipes();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Recipe GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

