

import { NextRequest, NextResponse } from "next/server";
import SavedRecipe from "@/lib/models/SavedRecipe";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const existing = await SavedRecipe.findOne({
      userId: body.userId,
      recipeId: body.recipeId,
    });

    if (existing) {
      return NextResponse.json({ saved: existing });
    }

    const saved = await SavedRecipe.create({
      userId: body.userId,
      recipeId: body.recipeId,
    });

    return NextResponse.json({ saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ saved: [] });
    }

    const saved = await SavedRecipe.find({ userId }).populate("recipeId");

    return NextResponse.json({ saved });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}