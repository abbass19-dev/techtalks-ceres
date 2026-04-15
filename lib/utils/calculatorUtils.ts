import { CalculatorData, CalculatorResults } from "./Types";

export const ACTIVITY_MAP: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export function calculateCalories({
  gender,
  age,
  height,
  weight,
  activity,
  goal,
  goalWeight,
  targetDate,
}: CalculatorData): CalculatorResults {
  let bmr = 0;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const maintenanceCalories = bmr * (ACTIVITY_MAP[activity] || 1.2);

  let goalCalories = maintenanceCalories;
  let floorHit = false;

  const minCalories = gender === "male" ? 1500 : 1200;

  if (goal === "lose") {
    if (goalWeight && targetDate) {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const today = new Date();
      const target = new Date(targetDate);

      const days = Math.ceil(
        (target.getTime() - today.getTime()) / MS_PER_DAY
      );

      const weightToLose = weight - goalWeight;

      if (days > 0 && weightToLose > 0) {
        const weeks = days / 7;

        const kgPerWeekNeeded = weightToLose / weeks;

        const healthyMinKgPerWeek = 0.25; // about 0.5 lb/week
        const healthyMaxKgPerWeek = 0.9;  // about 2 lb/week

        const cappedKgPerWeek = Math.min(
          healthyMaxKgPerWeek,
          Math.max(healthyMinKgPerWeek, kgPerWeekNeeded)
        );

        const dailyDeficit = (cappedKgPerWeek * 7700) / 7;

        goalCalories = maintenanceCalories - dailyDeficit;
      } else {
        goalCalories = maintenanceCalories - 500;
      }
    } else {
      goalCalories = maintenanceCalories - 500;
    }
  } else if (goal === "gain") {
    goalCalories = maintenanceCalories + 300;
  }

  if (goalCalories < minCalories) {
    goalCalories = minCalories;
    floorHit = true;
  }

  return {
    bmr: Math.round(bmr),
    calories: Math.round(maintenanceCalories),
    goalCalories: Math.round(goalCalories),
    floorHit,
  };
}