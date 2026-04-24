import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aliases: [String],
  category: String,

  per100g: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    sugar: Number,
    calcium: Number,
    iron: Number,
    magnesium: Number,
    vitaminA: Number,
    vitaminB: Number,
    vitaminC: Number,
    vitaminD: Number,
  },
});

IngredientSchema.index({ name: "text", aliases: "text" });

export default mongoose.models.Ingredient ||
  mongoose.model("Ingredient", IngredientSchema);