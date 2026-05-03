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
  visibility: "public" | "private"; // ✅ ADDED (important)
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

export interface Instruction {
  id: number;
  text?: string;
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
  tag?: string;
  author?: string;
  visibility?: "public" | "private"; // ✅ OPTIONAL (good for later use)
};

export type ScheduleState = Record<string, string[]>;