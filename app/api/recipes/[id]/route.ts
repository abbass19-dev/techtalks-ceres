import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Recipe from "@/lib/models/Recipe";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const recipe = await Recipe.findOne({
      _id: id,
      visibility: "public",
      status: "published",
    }).lean();

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe }, { status: 200 });
  } catch (error) {
    console.error("Recipe details GET error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}