import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { recipeService } from "@/lib/services/recipe.service";
import { createRecipeSchema } from "@/lib/validations/recipe";
import { parseRecipeRequest, RequestParseError } from "@/lib/utils/requestParser";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const userOnly = searchParams.get("userOnly") === "true";

    if (userOnly) {
      const userId = await verifyAuth(req);
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { recipes, error } = await recipeService.getRecipesByUser(userId);
      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
      return NextResponse.json({ recipes });
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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized or invalid token" },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await parseRecipeRequest(req);
    } catch (error) {
      if (error instanceof RequestParseError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }
      throw error;
    }

    const validationResult = createRecipeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid recipe data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { recipe, error } = await recipeService.addRecipe(
      validationResult.data,
      userId,
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Recipe POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
