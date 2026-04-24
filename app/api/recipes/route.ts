import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { recipeService } from "@/lib/services/recipe.service";
import { createRecipeSchema } from "@/lib/validations/recipe";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const validationResult = createRecipeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { recipe, error } = await recipeService.addRecipe(
      validationResult.data
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Recipe POST error:", error);

    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}