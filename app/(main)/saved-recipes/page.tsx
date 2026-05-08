"use client";
import CardItem from "../../components/CardItem";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Recipe } from "@/lib/utils/Types";
import {
  Search,
  Sunrise,
  Sun,
  Utensils,
  Coffee,
  Cookie,
  IceCream,
  Loader,
} from "lucide-react";

type SavedRecipeItem = {
  recipeId?: {
    _id: string;
    name: string;
    imageUrl?: string;
    category?: string;
    prepTime?: number;
    cookTime?: number;
    timeToCook?: number;
    user?: { name?: string };
    nutritionPerServing?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  };
};

function SavedRecipesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: "All", icon: Utensils },
    { id: "breakfast", icon: Coffee },
    { id: "lunch", icon: Sun },
    { id: "dinner", icon: Sunrise },
    { id: "snack", icon: Cookie },
    { id: "dessert", icon: IceCream },
  ];

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const userRes = await fetch("/api/auth/me");

        if (!userRes.ok) throw new Error("Not logged in");

        const userData = await userRes.json();
        const uid = userData?.user?.id;

        if (!uid) throw new Error("No user ID");

        const res = await fetch("/api/saved-recipes");
        const data = await res.json();

        const mappedRecipes: Recipe[] = ((data.saved || []) as SavedRecipeItem[])
          .map((s) => {
            const item = s.recipeId;
            if (!item) return null;

            return {
              id: item._id,
              title: item.name,
              image: item.imageUrl,
              calories: item.nutritionPerServing?.calories || 0,
              protein: item.nutritionPerServing?.protein || 0,
              carbs: item.nutritionPerServing?.carbs || 0,
              fat: item.nutritionPerServing?.fat || 0,
              category: item.category,
              author: item.user?.name || "Community",
              timeToCook:
                (item.prepTime || 0) + (item.cookTime || 0) ||
                item.timeToCook ||
                0,
            };
          })
          .filter(Boolean) as Recipe[];

        setRecipes(mappedRecipes);
        console.log("Mapped Recipes:", mappedRecipes);
      } catch (err) {
        console.error("Failed to fetch saved recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        recipe.category?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [recipes, search, filter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F6]">
      <main className="flex-1 w-full px-4 py-6 pb-32 md:pb-6">
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black">
                Saved Recipes
              </h2>
              <p className="mt-2 text-base sm:text-lg text-[#64748B]">
                Your curated collection of nutrient-dense meals tailored{" "}
                <br className="hidden sm:block" />
                for vital living and metabolic health.
              </p>
            </div>

            <Link
              href="/add-recipe"
              className="fixed bottom-20 right-4 sm:static z-50 flex items-center justify-center gap-1 w-14 h-14 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-gradient-to-br from-[#006C49] to-[#10B981] text-white rounded-full sm:rounded-lg shadow-lg sm:shadow-none text-2xl sm:text-sm font-medium"
            >
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">+ Add Recipe</span>
            </Link>
          </div>
        </section>

        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {filters.map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition ${
                  filter === item.id
                    ? "bg-[#006C49] text-white shadow-sm"
                    : "bg-[#DCE8FF] text-[#334155] hover:bg-[#DCE8FF]/70"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                {item.id}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-[320px]">
            <div className="flex h-11 items-center rounded-full bg-[#DCE8FF] px-4">
              <Search className="mr-2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search saved recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#64748B] outline-none"
              />
            </div>
          </div>
        </section>
        <section>
          {loading ? (
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-gray-500">
              <Loader className="mr-3 h-5 w-5 animate-spin text-[#006C49] transition-all duration-300 ease-linear" />
              LOADING...
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-gray-500">
              No recipes found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <CardItem key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SavedRecipesPage;
