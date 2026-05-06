import { NextRequest, NextResponse } from "next/server";
import SavedRecipe from "@/lib/models/SavedRecipe";
import { connectToDatabase } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    await connectToDatabase();

    const { recipeId } = await params;

    const userId = req.nextUrl.searchParams.get("userId");

    await SavedRecipe.findOneAndDelete({
      userId,
      recipeId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove recipe" },
      { status: 500 }
    );
  }
}

