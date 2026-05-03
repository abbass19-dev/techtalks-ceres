import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db";
import UserGoal from "@/lib/models/UserGoal";

const JWT_SECRET = process.env.JWT_SECRET || "default_development_secret";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

async function getUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const { payload } = await jwtVerify(token, encodedSecret);
  return payload.userId as string;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await UserGoal.findOne({ userId });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Goals GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const goals = await UserGoal.findOneAndUpdate(
      { userId },
      {
        userId,
        dailyCalories: body.dailyCalories,
        dailyProtein: body.dailyProtein,
        dailyCarbs: body.dailyCarbs,
        dailyFat: body.dailyFat,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return NextResponse.json({
      message: "Goals saved successfully",
      goals,
    });
  } catch (error) {
    console.error("Goals POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}