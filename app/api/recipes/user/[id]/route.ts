import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { recipeService } from "@/lib/services/recipe.service";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const requestedUserId = resolvedParams.id;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, encodedSecret);
    const authUserId = payload.userId as string;
    
    if (!authUserId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
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
