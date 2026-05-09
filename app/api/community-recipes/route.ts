import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Recipe from "@/lib/models/Recipe";
import { User } from "@/lib/models/User";
import type {
  CommunityRecipeDocument,
  CommunityUserDocument,
} from "@/lib/utils/Types";

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || "9"), 1),
      24,
    );
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      visibility: "public",
      status: "published",
    };

    if (search) {
      query.name = new RegExp(escapeRegex(search), "i");
    }

    if (category && category !== "All Recipes") {
      query.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    }

    const recipes = await Recipe.find(query)
      .select(
        "_id userId name imageUrl category prepTime cookTime nutritionPerServing.calories nutritionPerServing.protein nutritionPerServing.carbs nutritionPerServing.fat",
      )
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean<CommunityRecipeDocument[]>();

    const hasMore = recipes.length > limit;
    const pageRecipes = recipes.slice(0, limit);

    const userIds = [
      ...new Set(
        pageRecipes
          .map((recipe) => recipe.userId?.toString())
          .filter((userId): userId is string => Boolean(userId)),
      ),
    ];

    const users = await User.find({ _id: { $in: userIds } })
      .select("firstName lastName")
      .lean<CommunityUserDocument[]>();

    const usersById = new Map(
      users.map((user) => [
        user._id?.toString(),
        [user.firstName, user.lastName].filter(Boolean).join(" "),
      ]),
    );

    const recipesWithUsers = pageRecipes.map((recipe) => ({
      ...recipe,
      user: {
        name: usersById.get(recipe.userId?.toString()) || "Community",
      },
    }));

    return NextResponse.json(
      {
        recipes: recipesWithUsers,
        pagination: {
          page,
          limit,
          hasMore,
          nextPage: hasMore ? page + 1 : null,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("COMMUNITY_RECIPES_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
