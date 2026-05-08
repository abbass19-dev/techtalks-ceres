import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Ingredient from "@/lib/models/Ingredient";

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeIngredientName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, " ");

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const safeQuery = escapeRegex(query);
    const exactRegex = new RegExp(`^${safeQuery}$`, "i");
    const prefixRegex = new RegExp(`^${safeQuery}`, "i");
    const partialRegex = new RegExp(safeQuery, "i");

    const exactResults = await Ingredient.find({
      $or: [{ name: exactRegex }, { aliases: exactRegex }],
    })
      .select("name aliases category")
      .lean();

    const fallbackRegex = query.length >= 3 ? partialRegex : prefixRegex;
    const fallbackResults = await Ingredient.find({
      $or: [{ name: fallbackRegex }, { aliases: fallbackRegex }],
    })
      .limit(20)
      .select("name aliases category")
      .lean();

    const seen = new Set<string>();
    const results = [...exactResults, ...fallbackResults].filter((item) => {
      const key = normalizeIngredientName(item.name);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (!results.length) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = results.map((item) => ({
      name: item.name,
      aliases: item.aliases || [],
      category: item.category,
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[FOOD_SEARCH] Error:", error);
    return NextResponse.json(
      { suggestions: [], error: (error as Error).message },
      { status: 500 },
    );
  }
}
