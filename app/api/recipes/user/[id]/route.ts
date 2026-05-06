import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { recipeService } from "@/lib/services/recipe.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const requestedUserId = resolvedParams.id;

    const authUserId = await verifyAuth(req);
    
    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized or invalid token" }, { status: 401 });
    }

    // High security: ensure token owner matches the [id] param
    if (authUserId !== requestedUserId) {
      return NextResponse.json(
        { error: "Forbidden: Cannot access recipes of another user." },
        { status: 403 }
      );
    }

    const { recipes, error } = await recipeService.getRecipesByUser(authUserId);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ recipes: recipes || [] }, { status: 200 });
  } catch (error) {
    console.error("Recipe GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
