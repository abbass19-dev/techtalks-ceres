import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Ingredient from "@/lib/models/Ingredient";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const results = await Ingredient.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { aliases: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    })
      .limit(20)
      .select("name aliases category");

    const suggestions = results.map((item) => ({
      name: item.name,
      aliases: item.aliases,
      category: item.category,
    }));

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}