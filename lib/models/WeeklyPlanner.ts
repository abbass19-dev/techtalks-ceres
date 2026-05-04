import mongoose, { Document, Schema } from "mongoose";

export interface IWeeklyPlanner {
  userId: string;
  schedule: Map<string, string[]>;
}

export interface IWeeklyPlannerDocument extends IWeeklyPlanner, Document {}

const WeeklyPlannerSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
   schedule: {
  type: Map,
  of: [String],
  default: {},
},
  },
  {
    timestamps: true,
    collection: "weekly_planners",
  }
);

const WeeklyPlanner =
  mongoose.models.WeeklyPlanner ||
  mongoose.model<IWeeklyPlannerDocument>("WeeklyPlanner", WeeklyPlannerSchema, "weekly_planners");

export default WeeklyPlanner;
