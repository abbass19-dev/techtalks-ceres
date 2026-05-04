import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { plannerRepository } from "@/lib/repositories/planner.repository";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const encodedSecret = new TextEncoder().encode(JWT_SECRET);

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planner = await plannerRepository.findByUserId(userId);
    return NextResponse.json({ schedule: planner?.schedule || {} });
  } catch (error) {
    console.error("API_PLANNER_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { schedule } = body;

    if (!schedule || typeof schedule !== "object") {
      return NextResponse.json({ error: "Invalid schedule data" }, { status: 400 });
    }

    const updatedPlanner = await plannerRepository.updateSchedule(userId, schedule);
    return NextResponse.json({ schedule: updatedPlanner.schedule });
  } catch (error) {
    console.error("API_PLANNER_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
