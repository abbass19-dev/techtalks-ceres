import mongoose from "mongoose";
import { IRecipeDocument, RecipeSchema } from "./Recipe";

const RecipeDraft =
  mongoose.models.RecipeDraft ||
  mongoose.model<IRecipeDocument>("RecipeDraft", RecipeSchema, "recipe_drafts");

export default RecipeDraft;
