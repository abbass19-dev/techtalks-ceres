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

export type ScheduleState = Record<string, string[]>;
