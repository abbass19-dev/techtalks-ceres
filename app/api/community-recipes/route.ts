import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Recipe from "@/lib/models/Recipe";

export async function GET() {
  try {
    await connectToDatabase();

    const recipes = await Recipe.find({ visibility: "public", status: "published" })

      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("COMMUNITY_RECIPES_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
