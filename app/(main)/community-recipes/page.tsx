"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Search } from "lucide-react";
import {
  CommunityRecipesResponse,
  Recipe,
  SavedRecipeApiItem,
} from "@/lib/utils/Types";

const categories = [
  "All Recipes",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
];

const RECIPES_PER_PAGE = 9;

const getCardImageUrl = (image?: string) => {
  if (!image) return "/images/recipe-placeholder.jpg";
  if (!image.includes("res.cloudinary.com") || !image.includes("/upload/")) {
    return image;
  }

  return image.replace("/upload/", "/upload/f_auto,q_auto,c_fill,w_900,h_540/");
};

export default function CommunityRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const initUser = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          const uid = userData?.user?.id;
          if (uid) {
            setUserId(uid);
            const savedRes = await fetch("/api/saved-recipes");
            if (savedRes.ok) {
              const savedData = await savedRes.json();
              const ids = new Set<string>(
                ((savedData.saved || []) as SavedRecipeApiItem[])
                  .map((s) => s.recipeId?._id?.toString())
                  .filter((value): value is string => Boolean(value)),
              );
              setSavedIds(ids);
            }
          }
        }
      } catch (err) {
        console.error("Failed to init user", err);
      } finally {
        setAuthChecked(true);
      }
    };

    initUser();
  }, []);

  const fetchRecipes = useCallback(
    async (nextPage: number, replace = false) => {
      try {
        if (replace) setLoading(true);
        else setLoadingMore(true);

        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(RECIPES_PER_PAGE),
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (activeCategory !== "All Recipes") {
          params.set("category", activeCategory);
        }

        const res = await fetch(`/api/community-recipes?${params.toString()}`);
        const data = (await res.json()) as CommunityRecipesResponse;

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch recipes");
        }

        const mappedRecipes: Recipe[] = (data.recipes || []).map((item) => ({
          id: item._id,
          userId: item.userId,
          title: item.name,
          image: item.imageUrl,
          calories: item.nutritionPerServing?.calories || 0,
          protein: item.nutritionPerServing?.protein || 0,
          category: item.category,
          carbs: item.nutritionPerServing?.carbs || 0,
          fat: item.nutritionPerServing?.fat || 0,
          author: item.user?.name || "Community",
          timeToCook: (item.prepTime || 0) + (item.cookTime || 0),
        }));

        setRecipes((prev) => {
          if (replace) {
            return mappedRecipes;
          }

          const existingIds = new Set(prev.map((recipe) => recipe.id));
          const nextRecipes = mappedRecipes.filter(
            (recipe) => !existingIds.has(recipe.id),
          );

          return [...prev, ...nextRecipes];
        });
        setPage(nextPage);
        setHasMore(Boolean(data.pagination?.hasMore));
      } catch (err) {
        console.error("Failed to fetch recipes", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, search],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchRecipes(1, true);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRecipes]);

  const handleSave = async (recipeId: string) => {
    const recipe = recipes.find((item) => item.id === recipeId);

    if (recipe?.userId === userId) {
      return;
    }

    if (!userId) {
      alert("Please log in to save recipes!");
      return;
    }

    const isSaved = savedIds.has(recipeId);

    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });

    if (!isSaved) {
      await fetch("/api/saved-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
    } else {
      await fetch(`/api/saved-recipes/${recipeId}`, {
        method: "DELETE",
      });
    }
  };

  const handleNavigate = (id: string) => {
    router.push(`/community-recipes/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex flex-col">
      <main className="flex-1 w-full mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Community Recipes
        </h1>

        <p className="text-gray-500 mb-6 text-sm md:text-base">
          Discover and save bio-optimized recipes shared by the community
        </p>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#EAF0F6] text-gray-700 placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm transition ${
                  activeCategory === cat
                    ? "bg-[#1F8A5B] text-white"
                    : "bg-white text-gray-600 border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p className="text-gray-500 text-center">Loading recipes...</p>
        )}

        {!loading && recipes.length === 0 && (
          <p className="text-gray-500 text-center">No recipes found</p>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => {
              const isPriorityImage = index < 3;

              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="relative">
                    <div className="relative h-40 w-full md:h-48">
                      <Image
                        src={
                          brokenImageIds.has(recipe.id)
                            ? "/images/recipe-placeholder.jpg"
                            : getCardImageUrl(recipe.image)
                        }
                        alt={recipe.title}
                        fill
                        priority={isPriorityImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        onError={() =>
                          setBrokenImageIds((prev) => {
                            const next = new Set(prev);
                            next.add(recipe.id);
                            return next;
                          })
                        }
                      />
                    </div>

                    {authChecked && recipe.userId !== userId && (
                      <button
                        onClick={() => handleSave(recipe.id)}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
                        aria-label={
                          savedIds.has(recipe.id)
                            ? "Remove saved recipe"
                            : "Save recipe"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 md:w-5 md:h-5 ${
                            savedIds.has(recipe.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    )}

                    {recipe.category && (
                      <span className="absolute bottom-3 left-3 bg-green-100 text-green-600 text-[10px] md:text-xs px-2 py-1 rounded-full font-medium">
                        {recipe.category}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col">
                    <h2 className="font-semibold text-sm md:text-lg text-gray-900 mb-1">
                      {recipe.title}
                    </h2>

                    {recipe.author && (
                      <p className="text-[10px] md:text-xs text-gray-400 mb-3">
                        by {recipe.author}
                      </p>
                    )}

                    <div className="grid grid-cols-4 gap-2 mb-4 text-center text-[10px] md:text-xs">
                      <div className="bg-gray-100 rounded p-2">
                        <p className="text-gray-400">Kcal</p>
                        <p className="font-semibold text-gray-800">
                          {recipe.calories}
                        </p>
                      </div>

                      <div className="bg-gray-100 rounded p-2">
                        <p className="text-gray-400">Protein</p>
                        <p className="font-semibold text-gray-800">
                          {recipe.protein}g
                        </p>
                      </div>

                      <div className="bg-gray-100 rounded p-2">
                        <p className="text-gray-400">Carb</p>
                        <p className="font-semibold text-gray-800">
                          {recipe.carbs}g
                        </p>
                      </div>

                      <div className="bg-gray-100 rounded p-2">
                        <p className="text-gray-400">Fat</p>
                        <p className="font-semibold text-gray-800">
                          {recipe.fat}g
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigate(recipe.id)}
                      className="mt-auto bg-gradient-to-r from-[#1F8A5B] to-[#157347] text-white py-2 rounded-lg text-sm hover:opacity-90 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => fetchRecipes(page + 1)}
              disabled={loadingMore}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
              {loadingMore ? "Loading..." : "Show more"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
