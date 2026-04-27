import mongoose, { Document, Schema } from "mongoose";

export interface IWeeklyPlanner {
  userId: mongoose.Types.ObjectId;
  schedule: Map<string, mongoose.Types.ObjectId[]>;
}

export interface IWeeklyPlannerDocument extends IWeeklyPlanner, Document {}

const WeeklyPlannerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    schedule: {
      type: Map,
      of: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
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
