import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { recipeService } from "@/lib/services/recipe.service";
import { parseRecipeRequest, RequestParseError } from "@/lib/utils/requestParser";
import { updateRecipeSchema } from "@/lib/validations/recipe";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await params;
    const authUserId = await verifyAuth(req);

    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized or invalid token" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await parseRecipeRequest(req);
    } catch (error) {
      if (error instanceof RequestParseError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }
      throw error;
    }

    const validationResult = updateRecipeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid recipe data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { recipe, error } = await recipeService.updateRecipeByUser(
      recipeId,
      authUserId,
      validationResult.data
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Recipe updated successfully",
        recipe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recipe PATCH error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await params;
    const authUserId = await verifyAuth(req);

    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized or invalid token" },
        { status: 401 }
      );
    }

    const { success, error } = await recipeService.deleteRecipeByUser(
      recipeId,
      authUserId
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Recipe deleted successfully",
        success,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recipe DELETE error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await params;
    const authUserId = await verifyAuth(req);
    const { recipe, error } = await recipeService.getRecipeByIdForViewer(
      recipeId,
      authUserId
    );

    if (error) {
      return NextResponse.json({ error }, { status: 404 });
    }

    return NextResponse.json({ recipe }, { status: 200 });
  } catch (error) {
    console.error("Recipe GET by ID error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
