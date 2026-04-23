import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema(
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
  },
  {
    timestamps: true,
    collection: "recipes",
  },
);

const Recipe =
  mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema, "recipes");

export { Recipe };
