import { LucideIcon } from "lucide-react";

export type CalculatorData = {
  gender: "male" | "female";
  age: number;
  height: number;
  weight: number;
  activity: "sedentary" | "light" | "moderate" | "active";
  goal: "lose" | "maintain" | "gain";
  goalWeight?: number;
  targetDate?: string;
};

export type UserGender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export type CalculatorResults = {
  bmr: number;
  calories: number;
  goalCalories: number;
  floorHit: boolean;
};

export type CardItem = {
  id: string;
  title: string;
  category: string;
  calories: number;
  protein: number;
  time: string;
  minutes: number;
  image: string;
};

export type NavbarUser = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export interface RecipeForm {
  name: string;
  description: string;
  category: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  visibility: "public" | "private";
  status: "draft" | "published";
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  selectedName?: string;
}

export interface Instruction {
  id: number;       // local UI key only
  title: string;
  description: string;
}

export type FoodSuggestion = {
  name: string;
  aliases?: string[];
  category?: string;
};

export type Recipe = {
  id: string;
  title: string;
  image?: string;
  calories: number;
  protein: number;
  category?: string;
  carbs: number;
  fat: number;
  tag?: string;
  author?: string;
  status?: "draft" | "published";
  timeToCook?: number;
  visibility?: "public" | "private"; // ✅ OPTIONAL (good for later use)
};
export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  minerals?: {
    calcium: number;
    iron: number;
    potassium: number;
    magnesium: number;
  };
  vitamins?: {
    vitaminA: number;
    vitaminB: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
  };
};

export type RecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
  gramsUsed?: number;
};

export type RecipeInstruction = {
  step: number;
  title: string;
  description: string;
};

export type DashboardMeal = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  instructions?: RecipeInstruction[];
  ingredients?: RecipeIngredient[];
  totalNutrition?: NutritionTotals;
  nutritionPerServing?: NutritionTotals;
};

export type ScheduleState = Record<string, string[]>;

export interface NutrientIntake {
  value: number;
  percent: number;
}

export interface DailyNutrientIntake {
  calcium: NutrientIntake;
  iron: NutrientIntake;
  magnesium: NutrientIntake;
  potassium: NutrientIntake;
  vitaminA: NutrientIntake;
  vitaminB: NutrientIntake;
  vitaminC: NutrientIntake;
  vitaminD: NutrientIntake;
  vitaminE: NutrientIntake;
}

export interface RecommendedDailyValues {
  calcium: number;
  iron: number;
  magnesium: number;
  potassium: number;
  vitaminA: number;
  vitaminB: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
}

// USDA / FDA 2020 Daily Reference Values (per person per day)
export const DEFAULT_RDI: RecommendedDailyValues = {
  calcium: 1300,    // mg/day  (FDA DV)
  iron: 18,         // mg/day  (FDA DV)
  magnesium: 420,   // mg/day  (FDA DV)
  potassium: 4700,  // mg/day  (FDA DV)
  vitaminA: 900,    // mcg RAE/day (FDA DV)
  vitaminB: 2.4,    // mcg/day  — Vitamin B12 (FDA DV)
  vitaminC: 90,     // mg/day  (FDA DV)
  vitaminD: 20,     // mcg/day (FDA DV)
  vitaminE: 15,     // mg/day  (FDA DV)
};

export interface UserNutrientTotals {
  minerals: {
    calcium: number;
    iron: number;
    magnesium: number;
    potassium: number;
  };
  vitamins: {
    vitaminA: number;
    vitaminB: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
  };
}

export interface RecipeNutritionData {
  nutritionPerServing: {
    minerals: { calcium: number; iron: number; magnesium: number; potassium: number };
    vitamins: { vitaminA: number; vitaminB: number; vitaminC: number; vitaminD: number; vitaminE: number };
  };
  servings: number;
}

export type BalanceItem = {
  label: string;
  value: number;
  amount: number;
  unit: string;
  icon: LucideIcon;
};

export type StatItem = {
  title: string;
  value: string | number;
  target: string;
  progress: number;
  icon: LucideIcon;
};

export type UserProfile = {
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: "" | UserGender;
  activityLevel: "" | ActivityLevel;
  age: string;
  weight: string;
  height: string;
};
