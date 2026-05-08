import type { ActivityLevel, UserGender } from "@/lib/utils/Types";

export type GoalRecommendationInput = {
  gender?: UserGender;
  age?: number;
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
};

export type GoalRecommendation = {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
};

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export function getRecommendedGoals({
  gender,
  age,
  height,
  weight,
  activityLevel = "sedentary",
}: GoalRecommendationInput): GoalRecommendation | null {
  if (!gender || !age || !height || !weight || gender === "other") {
    return null;
  }

  // Mifflin-St Jeor estimate. These are suggestions only; users can override them.
  const base =
    10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);
  const dailyCalories = Math.round(base * ACTIVITY_MULTIPLIER[activityLevel]);
  const dailyProtein = Math.round(weight * 1.6);
  const dailyFat = Math.round((dailyCalories * 0.25) / 9);
  const dailyCarbs = Math.max(
    0,
    Math.round((dailyCalories - dailyProtein * 4 - dailyFat * 9) / 4),
  );

  return {
    dailyCalories,
    dailyProtein,
    dailyCarbs,
    dailyFat,
  };
}
