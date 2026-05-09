import type { CalculatorData, CalculatorResults } from "./Types";

export const ACTIVITY_MAP: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const MS_PER_DAY = 86_400_000;
const CALORIES_PER_KG = 7_700;

const DEFAULT_ADJUSTMENT = {
  lose: -500,
  gain: 300,
  maintain: 0,
} as const;

const MAX_WEEKLY_CHANGE = {
  lose: 0.9,
  gain: 0.5,
} as const;

const getDaysUntilTarget = (targetDate?: string) => {
  if (!targetDate) return 0;

  const today = new Date();
  const target = new Date(targetDate);

  if (Number.isNaN(target.getTime())) return 0;

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);
};

const calculateBmr = ({ gender, age, height, weight }: CalculatorData) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
};

const getGoalAdjustment = (data: CalculatorData) => {
  const { goal, weight, goalWeight, targetDate } = data;

  if (goal === "maintain") return 0;

  const days = getDaysUntilTarget(targetDate);
  const targetWeight = goalWeight ?? weight;
  const weightChange =
    goal === "lose" ? weight - targetWeight : targetWeight - weight;

  if (days <= 0 || weightChange <= 0) {
    return DEFAULT_ADJUSTMENT[goal];
  }

  const requestedDailyChange = (weightChange * CALORIES_PER_KG) / days;
  const maxDailyChange = (MAX_WEEKLY_CHANGE[goal] * CALORIES_PER_KG) / 7;
  const safeDailyChange = Math.min(requestedDailyChange, maxDailyChange);

  return goal === "lose" ? -safeDailyChange : safeDailyChange;
};

export function calculateCalories(data: CalculatorData): CalculatorResults {
  const bmr = calculateBmr(data);
  const maintenanceCalories =
    bmr * (ACTIVITY_MAP[data.activity] ?? ACTIVITY_MAP.sedentary);

  let goalCalories = maintenanceCalories + getGoalAdjustment(data);

  const minCalories = data.gender === "male" ? 1500 : 1200;
  const floorHit = goalCalories < minCalories;

  if (floorHit) {
    goalCalories = minCalories;
  }

  return {
    bmr: Math.round(bmr),
    calories: Math.round(maintenanceCalories),
    goalCalories: Math.round(goalCalories),
    floorHit,
  };
}
