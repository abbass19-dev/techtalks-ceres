import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db";
import { recipeService } from "@/lib/services/recipe.service";
import { createRecipeSchema } from "@/lib/validations/recipe";
import { parseRecipeRequest, RequestParseError } from "@/lib/utils/requestParser";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check if user is requesting their own recipes
    const token = req.cookies.get("token")?.value;
    const searchParams = req.nextUrl.searchParams;
    const userOnly = searchParams.get("userOnly") === "true";

    if (userOnly && token) {
      try {
        const { payload } = await jwtVerify(token, encodedSecret);
        const userId = payload.userId as string;
        if (userId) {
          const { recipes, error } =
            await recipeService.getRecipesByUser(userId);
          if (error) {
            return NextResponse.json({ error }, { status: 500 });
          }
          return NextResponse.json({ recipes });
        }
      } catch (e) {
        // Fall through to getAllRecipes if token is invalid
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

export async function POST(req: NextRequest) {
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
          error: "Validation failed",
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
      { status: 500 },
    );
  }
}
