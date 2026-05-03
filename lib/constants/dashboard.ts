import {
  Flame, Beef, Wheat, Droplet,
  Bone, Hammer, Leaf, Zap,
  Eye, Brain, Citrus, Sun, Shield,
} from "lucide-react";
import { NutritionTotals, DailyNutrientIntake, BalanceItem, StatItem } from "@/lib/utils/Types";
import { LucideIcon } from "lucide-react";

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
  "Stay hydrated — water boosts everything 💧",
  "Start your day with a balanced breakfast 🌅",
  "Protein keeps you full and supports muscle 💪",
  "Add vegetables to every meal 🥦",
  "Choose whole foods over processed 🌿",
  "Eat slowly and mindfully 🧘‍♂️",
  "Balance carbs, protein, and fats ⚖️",
  "Fruits are natural sources of vitamins 🍎",
  "Limit added sugar for steady energy 🍭",
  "Plan meals to avoid unhealthy choices 📅",

  "Consistency beats perfection 🔁",
  "Healthy eating is a lifestyle, not a diet 🧠",
  "Small changes lead to big results 🚀",
  "Don’t skip meals — fuel your body 🍽️",
  "Listen to your hunger signals 👂",
  "Avoid overeating late at night 🌙",
  "Cook more meals at home 🍳",
  "Reduce fried food intake 🍟",
  "Choose healthy snacks 🥜",
  "Eat enough fiber for digestion 🌾",

  "Stay active — movement matters 🏃‍♂️",
  "Sleep well to support your metabolism 😴",
  "Drink water before meals 💧",
  "Track your nutrition to stay consistent 📊",
  "Don’t drink your calories 🥤",
  "Eat colorful meals for nutrients 🌈",
  "Healthy fats are important (not the enemy) 🥑",
  "Avoid extreme diets 🚫",
  "Moderation is key ⚖️",
  "Focus on long-term habits ⏳",

  "Meal prep saves time and keeps you on track 📦",
  "Choose grilled over fried 🍗",
  "Read food labels 🏷️",
  "Reduce salt intake 🧂",
  "Add protein to snacks 🍳",
  "Stay consistent with your goals 🎯",
  "Drink less soda and sugary drinks 🥤",
  "Eat natural, simple ingredients 🌿",
  "Be patient with your progress 🕒",
  "Hydration improves focus and energy ⚡",

  "Avoid emotional eating when stressed 😶",
  "Eat until satisfied, not full 🍽️",
  "Keep healthy food accessible 🥗",
  "Limit fast food 🍔",
  "Your body needs variety 🧬",
  "Healthy habits build discipline 🧠",
  "Fuel your body, don’t punish it ❤️",
  "Progress > perfection 📈",
  "Make your health a priority 🥇",
  "You are what you eat 🍎",
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
