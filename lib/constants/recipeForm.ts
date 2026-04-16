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

export const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Drink",
];

export const UNITS = {
  Weight: ["g", "kg"],
  Volume: ["ml", "l", "cup"],
  Count: ["piece", "slice"],
};

export const createIngredient = (): Ingredient => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  name: "",
  quantity: "",
  unit: "",
});

export const createInstruction = (): Instruction => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  text: "",
});

export const initialRecipe: RecipeForm = {
  name: "",
  description: "",
  category: "",
  servings: "",
  prepTime: "",
  cookTime: "",
};

export const updateIngredientById = (
  items: Ingredient[],
  id: number,
  field: keyof Ingredient,
  value: string
) => {
  return items.map((item) =>
    item.id === id ? { ...item, [field]: value } : item
  );
};

export const removeIngredientById = (items: Ingredient[], id: number) => {
  return items.filter((item) => item.id !== id);
};

export const updateInstructionById = (
  items: Instruction[],
  id: number,
  value: string
) => {
  return items.map((item) =>
    item.id === id ? { ...item, text: value } : item
  );
};

export const removeInstructionById = (items: Instruction[], id: number) => {
  return items.filter((item) => item.id !== id);
};