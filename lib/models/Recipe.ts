import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe {
  name: string;
  description: string;
  category: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  imageUrl?: string;
  visibility: "public" | "private";
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

    minerals?: {
      calcium?: number;
      iron?: number;
      potassium?: number;
      magnesium?: number;
    };

    vitamins?: {
      vitaminA?: number;
      vitaminB?: number;
      vitaminC?: number;
      vitaminD?: number;
      vitaminE?: number;
    };
  }[];

  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;

    minerals?: {
      calcium?: number;
      iron?: number;
      potassium?: number;
      magnesium?: number;
    };

    vitamins?: {
      vitaminA?: number;
      vitaminB?: number;
      vitaminC?: number;
      vitaminD?: number;
      vitaminE?: number;
    };
  };
  visibility: "public" | "private";
}

export interface IRecipeDocument extends IRecipe, Document {}

const RecipeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
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
    imageUrl: {
      type: String,
      required: false,
    },

    
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true,
      index: true,
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
        minerals: {
          calcium: Number,
          iron: Number,
          potassium: Number,
          magnesium: Number,
        },
        vitamins: {
          vitaminA: Number,
          vitaminB: Number,
          vitaminC: Number,
          vitaminD: Number,
          vitaminE: Number,
        },
      },
    ],
    totalNutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      minerals: {
        calcium: { type: Number, default: 0 },
        iron: { type: Number, default: 0 },
        potassium: { type: Number, default: 0 },
        magnesium: { type: Number, default: 0 },
      },
      vitamins: {
        vitaminA: { type: Number, default: 0 },
        vitaminB: { type: Number, default: 0 },
        vitaminC: { type: Number, default: 0 },
        vitaminD: { type: Number, default: 0 },
        vitaminE: { type: Number, default: 0 },
      },
    },
    nutritionPerServing: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      minerals: {
        calcium: { type: Number, default: 0 },
        iron: { type: Number, default: 0 },
        potassium: { type: Number, default: 0 },
        magnesium: { type: Number, default: 0 },
      },
      vitamins: {
        vitaminA: { type: Number, default: 0 },
        vitaminB: { type: Number, default: 0 },
        vitaminC: { type: Number, default: 0 },
        vitaminD: { type: Number, default: 0 },
        vitaminE: { type: Number, default: 0 },
      },
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
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
