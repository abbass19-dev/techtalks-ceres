import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe {
  name: string;
  description: string;
  category: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  imageUrl?: string;
  instructions?: {
  step: number;
  title: string;
  description: string;
}[];
  visibility: "public" | "private";
  status: "draft" | "published";

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
}

export interface IRecipeDocument extends IRecipe, Document {}

export const RecipeSchema = new Schema(
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
instructions: [
  {
    step: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
],

    
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
      index:true
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
  },
  {
    timestamps: true,
  },
);

const Recipe =
  mongoose.models.Recipe ||
  mongoose.model<IRecipeDocument>("Recipe", RecipeSchema, "recipes");

export default Recipe;
