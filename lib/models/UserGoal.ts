import mongoose, { Schema, models } from "mongoose";

const UserGoalSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dailyCalories: { type: Number, default: 0 },
    dailyProtein: { type: Number, default: 0 },
    dailyCarbs: { type: Number, default: 0 },
    dailyFat: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default models.UserGoal || mongoose.model("UserGoal", UserGoalSchema);