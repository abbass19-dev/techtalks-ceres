import { NextRequest, NextResponse } from "next/server";
import SavedRecipe from "@/lib/models/SavedRecipe";
import { connectToDatabase } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    await connectToDatabase();

    const { recipeId } = await params;
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await SavedRecipe.findOneAndDelete({
      userId,
      recipeId,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove recipe" },
      { status: 500 }
    );
  }
}

