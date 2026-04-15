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
