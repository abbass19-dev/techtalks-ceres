import { DailyNutrientIntake, BalanceItem, StatItem } from "@/lib/utils/Types";
import { Flame, Beef, Wheat, Droplet, Bone, Hammer, Leaf, Zap, Eye, Brain, Citrus, Sun, Shield } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { NutritionTotals } from "../utils/Types";

export const EMPTY_TOTALS: NutritionTotals = {
  calories: 0, protein: 0, carbs: 0, fat: 0,
  minerals: { calcium: 0, iron: 0, potassium: 0, magnesium: 0 },
  vitamins: { vitaminA: 0, vitaminB: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0 },
};

export const STAT_STYLES: Record<string, { color: string; bar: string }> = {
  Calories: { color: "text-[#111827]", bar: "bg-[#0E8A5F]" },
  Protein:  { color: "text-[#16A34A]", bar: "bg-[#16A34A]" },
  Carbs:    { color: "text-[#F59E0B]", bar: "bg-[#F59E0B]" },
  Fat:      { color: "text-[#6B7280]", bar: "bg-[#6B7280]" },
};

export const DEFAULT_GOALS = {
  dailyCalories: 2000,
  dailyProtein: 150,
  dailyCarbs: 250,
  dailyFat: 70,
};

export const TIPS = [
  "Drink more water 💧",
  "Add vegetables to your meals 🥦",
  "Avoid processed sugar 🍭",
  "Eat more protein for muscle recovery 💪",
  "Don't skip meals 🍽️",
  "Balance your carbs and fats ⚖️",
  "Include fruits in your diet 🍎",
  "Reduce fried food 🍟",
];

const NUTRIENT_MAP: { key: keyof DailyNutrientIntake; label: string; unit: string; icon: LucideIcon }[] = [
  { key: "calcium",   label: "Calcium",    unit: "mg",  icon: Bone },
  { key: "iron",      label: "Iron",       unit: "mg",  icon: Hammer },
  { key: "potassium", label: "Potassium",  unit: "mg",  icon: Leaf },
  { key: "magnesium", label: "Magnesium",  unit: "mg",  icon: Zap },
  { key: "vitaminA",  label: "Vitamin A",  unit: "mcg", icon: Eye },
  { key: "vitaminB",  label: "Vitamin B",  unit: "mcg", icon: Brain },
  { key: "vitaminC",  label: "Vitamin C",  unit: "mg",  icon: Citrus },
  { key: "vitaminD",  label: "Vitamin D",  unit: "mcg", icon: Sun },
  { key: "vitaminE",  label: "Vitamin E",  unit: "mg",  icon: Shield },
];

export function buildBalance(np: DailyNutrientIntake): BalanceItem[] {
  return NUTRIENT_MAP.map(({ key, label, unit, icon }) => ({
    label,
    value: np[key].percent,
    amount: np[key].value,
    unit,
    icon,
  }));
}

export function buildStats(
  totals: NutritionTotals,
  goals: typeof DEFAULT_GOALS | null,
  period: "week" | "month",
): StatItem[] {
  const m = period === "month" ? 30 : 7;
  const g = goals || DEFAULT_GOALS;
  const make = (title: string, raw: number, daily: number, unit: string, icon: LucideIcon): StatItem => ({
    title,
    value: unit ? `${Math.round(raw)}${unit}` : Math.round(raw),
    target: `/${daily * m}${unit}`,
    progress: Math.min((raw / (daily * m)) * 100, 100),
    icon,
  });
  return [
    make("Calories", totals.calories, g.dailyCalories, "", Flame),
    make("Protein",  totals.protein,  g.dailyProtein,  "g", Beef),
    make("Carbs",    totals.carbs,    g.dailyCarbs,    "g", Wheat),
    make("Fat",      totals.fat,      g.dailyFat,      "g", Droplet),
  ];
}
export function getDailyRandomTip() {
  const today = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash += today.charCodeAt(i);
  }

  const index = hash % TIPS.length;
  return TIPS[index];
}
