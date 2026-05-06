import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Ingredient from "@/lib/models/Ingredient";

export async function GET(req: NextRequest) {
  try {
    console.log("[FOOD_SEARCH] Connecting to database...");
    await connectToDatabase();
    console.log("[FOOD_SEARCH] Database connected!");

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    console.log("[FOOD_SEARCH] Query received:", query);

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${safeQuery}$`, "i");

    const results = await Ingredient.find({
      $or: [{ name: { $regex: regex } }, { aliases: { $regex: regex } }],
    })
      .limit(20)
      .select("name aliases category")
      .lean();

    console.log("[FOOD_SEARCH] Results found:", results.length);
    if (results.length > 0) {
      console.log("[FOOD_SEARCH] First result:", JSON.stringify(results[0]));
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
