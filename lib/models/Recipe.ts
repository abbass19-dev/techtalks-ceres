import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe {
  name: string;
  description: string;
  category: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    gramsUsed: number;
    nutrients: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface IRecipeDocument extends IRecipe, Document {}

const RecipeSchema = new Schema(
  {
    name: String,
    description: String,
    category: String,
    servings: Number,
    prepTime: Number,
    cookTime: Number,

    ingredients: [
      {
        name: String,
        quantity: Number,
        unit: String,
        gramsUsed: Number,
        nutrients: {
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        },
      },
    ],

    totalNutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: "recipes",
  },
);

const Recipe =
  mongoose.models.Recipe ||
  mongoose.model<IRecipeDocument>("Recipe", RecipeSchema, "recipes");

export default Recipe;