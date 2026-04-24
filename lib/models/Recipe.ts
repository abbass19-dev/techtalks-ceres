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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    prepTime: {
      type: Number,
      required: false,
    },
    cookTime: {
      type: Number,
      required: false,
    },
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