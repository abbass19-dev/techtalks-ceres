import { connectToDatabase } from "@/lib/db";
import WeeklyPlanner, { IWeeklyPlannerDocument } from "@/lib/models/WeeklyPlanner";

export class PlannerRepository {
  async findByUserId(userId: string): Promise<IWeeklyPlannerDocument | null> {
    await connectToDatabase();
    return WeeklyPlanner.findOne({ userId });
  }

  async updateSchedule(userId: string, schedule: Record<string, string[]>): Promise<IWeeklyPlannerDocument> {
    await connectToDatabase();
    return WeeklyPlanner.findOneAndUpdate(
      { userId },
      { $set: { schedule } },
      { upsert: true, returnDocument: "after" }
    );
  }
}

export const plannerRepository = new PlannerRepository();
