import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db";
import UserGoal from "@/lib/models/UserGoal";
import { userRepository } from "@/lib/repositories/user.repository";
import { getRecommendedGoals } from "@/lib/utils/goalRecommendations";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

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

    const [goals, user] = await Promise.all([
      UserGoal.findOne({ userId }),
      userRepository.findById(userId),
    ]);
    const recommendations = getRecommendedGoals({
      gender: user?.gender,
      age: user?.age,
      height: user?.height,
      weight: user?.weight,
      activityLevel: user?.activityLevel,
    });

    return NextResponse.json({ goals, recommendations });
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
    const dailyCalories = Number(body.dailyCalories);
    const dailyProtein = Number(body.dailyProtein);
    const dailyCarbs = Number(body.dailyCarbs);
    const dailyFat = Number(body.dailyFat);

    if (
      [dailyCalories, dailyProtein, dailyCarbs, dailyFat].some(
        (value) => !Number.isFinite(value) || value < 0,
      )
    ) {
      return NextResponse.json(
        { error: "Goals must be valid non-negative numbers" },
        { status: 400 },
      );
    }

    const goals = await UserGoal.findOneAndUpdate(
      { userId },
      {
        userId,
        dailyCalories,
        dailyProtein,
        dailyCarbs,
        dailyFat,
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
