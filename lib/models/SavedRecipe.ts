import mongoose, { Schema } from "mongoose";

const SavedRecipeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SavedRecipe ||
  mongoose.model("SavedRecipe", SavedRecipeSchema);