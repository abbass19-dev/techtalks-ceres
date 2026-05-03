import {
  RecommendedDailyValues,
  UserNutrientTotals,
  DailyNutrientIntake,
  RecipeNutritionData,
  DEFAULT_RDI,
} from "./Types";

// percent = actual / (daily_RDI × days) × 100, capped at 200
export function calculateNutrientPercentages(
  totals: UserNutrientTotals,
  rdi: RecommendedDailyValues = DEFAULT_RDI,
  days = 1,
): DailyNutrientIntake {
  const pct = (v: number, r: number) => Math.min((v / (r * days)) * 100, 200);
  const { minerals: m, vitamins: v } = totals;
  return {
    calcium:   { value: m.calcium,   percent: pct(m.calcium,   rdi.calcium)   },
    iron:      { value: m.iron,       percent: pct(m.iron,       rdi.iron)      },
    magnesium: { value: m.magnesium,  percent: pct(m.magnesium,  rdi.magnesium) },
    potassium: { value: m.potassium,  percent: pct(m.potassium,  rdi.potassium) },
    vitaminA:  { value: v.vitaminA,   percent: pct(v.vitaminA,   rdi.vitaminA)  },
    vitaminB:  { value: v.vitaminB,   percent: pct(v.vitaminB,   rdi.vitaminB)  },
    vitaminC:  { value: v.vitaminC,   percent: pct(v.vitaminC,   rdi.vitaminC)  },
    vitaminD:  { value: v.vitaminD,   percent: pct(v.vitaminD,   rdi.vitaminD)  },
    vitaminE:  { value: v.vitaminE,   percent: pct(v.vitaminE,   rdi.vitaminE)  },
  };
}

export function getNutrientColor(percent: number): string {
  if (percent >= 100) return "bg-green-500";
  if (percent >= 50)  return "bg-yellow-400";
  return "bg-red-400";
}

export function getNutrientStatus(percent: number): string {
  if (percent < 50)   return "Low";
  if (percent <= 100) return "Good";
  if (percent <= 150) return "High";
  return "Excessive";
}

export function formatNutrientValue(value: number, unit: string, decimals = 1): string {
  return `${value.toFixed(decimals)} ${unit}`;
}

export function aggregateRecipeNutrients(recipes: RecipeNutritionData[]): UserNutrientTotals {
  const acc: UserNutrientTotals = {
    minerals: { calcium: 0, iron: 0, magnesium: 0, potassium: 0 },
    vitamins: { vitaminA: 0, vitaminB: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0 },
  };
  for (const recipe of recipes) {
    const s = recipe.servings || 1;
    const mn = recipe.nutritionPerServing?.minerals;
    const vt = recipe.nutritionPerServing?.vitamins;
    if (mn) {
      acc.minerals.calcium   += (mn.calcium   || 0) * s;
      acc.minerals.iron      += (mn.iron      || 0) * s;
      acc.minerals.magnesium += (mn.magnesium || 0) * s;
      acc.minerals.potassium += (mn.potassium || 0) * s;
    }
    if (vt) {
      acc.vitamins.vitaminA += (vt.vitaminA || 0) * s;
      acc.vitamins.vitaminB += (vt.vitaminB || 0) * s;
      acc.vitamins.vitaminC += (vt.vitaminC || 0) * s;
      acc.vitamins.vitaminD += (vt.vitaminD || 0) * s;
      acc.vitamins.vitaminE += (vt.vitaminE || 0) * s;
    }
  }
  return acc;
}
