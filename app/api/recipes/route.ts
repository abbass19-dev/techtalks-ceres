import { NextResponse } from "next/server";
import { createRecipeSchema } from "@/lib/validations/recipe";
import { recipeService } from "@/lib/services/recipe.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = createRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { recipe, error } = await recipeService.addRecipe(validationResult.data);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Recipe POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
