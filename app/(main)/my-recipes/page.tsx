"use client";

import CardItem from "@/app/components/CardItem";
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
  ChefHat,
  Pencil,
  Trash2,
  Plus,
  BookOpen,
  Eye,
  FileText,
} from "lucide-react";

type RecipeListItem = {
  _id: string;
  name: string;
  imageUrl?: string;
  category?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  visibility?: "public" | "private";
  status?: "draft" | "published";
  nutritionPerServing?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
};

function MyRecipesPage() {
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
    const fetchMyRecipes = async () => {
      try {
        const res = await fetch("/api/recipes/user");
        if (!res.ok) throw new Error("Failed to fetch user recipes");

        const data = await res.json();

        const mappedRecipes: Recipe[] = ((data.recipes || []) as RecipeListItem[])
          .map((item) => {
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
              author: "You",
              visibility: item.visibility,
              status: item.status,
              timeToCook: (item.prepTime || 0) + (item.cookTime || 0),
            };
          })
          .filter(Boolean) as Recipe[];

        setRecipes(mappedRecipes);
      } catch (err) {
        console.error("Failed to fetch my recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recipe?")) return;
    try {
      await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete recipe", err);
    }
  };

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

  const publicCount = recipes.filter((recipe) => recipe.visibility === "public").length;
  const draftCount = recipes.filter((recipe) => recipe.status === "draft").length;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7F6]">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-32 md:pb-8 lg:px-8">
        <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#006C49] to-[#10B981] shadow-sm">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                  My Recipes
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Manage drafts, private meals, and recipes you&apos;ve shared with the community.
                </p>
              </div>
            </div>

            <Link
              href="/add-recipe"
              className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#006C49] to-[#10B981] text-2xl font-semibold text-white shadow-lg transition hover:shadow-xl sm:static sm:h-11 sm:w-auto sm:rounded-xl sm:px-4 sm:text-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">New Recipe</span>
            </Link>
          </div>

          {!loading && recipes.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={BookOpen} label="Total Recipes" value={recipes.length} />
              <StatCard icon={Utensils} label="Categories" value={new Set(recipes.map((r) => r.category).filter(Boolean)).size} />
              <StatCard icon={Eye} label="Public" value={publicCount} />
              <StatCard icon={FileText} label="Drafts" value={draftCount} />
            </div>
          )}
        </section>

        <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {filters.map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold capitalize transition ${
                  filter === item.id
                    ? "bg-[#006C49] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-[#006C49]"
                }`}
              >
                {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                {item.id}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-[360px]">
            <div className="flex h-11 items-center rounded-xl bg-slate-100 px-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-[#006C49]">
              <Search className="mr-2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search your recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#64748B] outline-none"
              />
            </div>
          </div>
          </div>
        </section>

        <section>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[390px] animate-pulse rounded-2xl border border-slate-100 bg-white"
                />
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="flex min-h-[340px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-gray-500">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <ChefHat className="h-7 w-7 text-[#006C49]" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {recipes.length === 0
                  ? "You haven't added any recipes yet."
                  : "No recipes match your search."}
              </p>
              {recipes.length === 0 && (
                <Link
                  href="/add-recipe"
                  className="mt-1 rounded-full bg-[#006C49] px-5 py-2 text-sm font-medium text-white hover:bg-[#005a3c] transition"
                >
                  Create your first recipe
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="group relative">
                  <CardItem recipe={recipe} href={`/my-recipes/${recipe.id}`} />

                  <div className="absolute right-3 top-3 flex gap-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <Link
                      href={`/my-recipes/${recipe.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006C49] shadow-md transition hover:bg-[#006C49] hover:text-white"
                      aria-label={`Edit ${recipe.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(recipe.id);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-400 shadow-md transition hover:bg-red-500 hover:text-white"
                      aria-label={`Delete ${recipe.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyRecipesPage;

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-[#006C49]" />
      </div>
      <p className="mt-1 text-2xl font-extrabold text-slate-950">{value}</p>
    </div>
  );
}
