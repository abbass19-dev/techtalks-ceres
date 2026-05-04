"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Heart } from "lucide-react";
import { Recipe } from "@/lib/utils/Types";

const categories = [
  "All Recipes",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
];

export default function CommunityRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ UPDATED: fetch from backend instead of mock data
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/community-recipes");
        const data = await res.json();

        const mappedRecipes: Recipe[] = (data.recipes || []).map(
          (item: any) => ({
            id: item._id,
            title: item.name,
            image: item.imageUrl,
            calories: item.totalNutrition?.calories || 0,
            protein: item.totalNutrition?.protein || 0,
            category: item.category,
            author: "Community",
          }),
        );

        setRecipes(mappedRecipes);
      } catch (err) {
        console.error("Failed to fetch recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All Recipes" ||
        recipe.category?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [recipes, search, activeCategory]);

  const handleNavigate = (id: string) => {
    router.push(`/recipes/${id}`);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5]  flex flex-col">
      <Navbar />

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
              placeholder="Search by name or ingredient..."
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

        {!loading && filteredRecipes.length === 0 && (
          <p className="text-gray-500 text-center">No recipes found 🥲</p>
        )}

        {!loading && filteredRecipes.length > 0 && (
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-40 md:h-48 object-cover"
                    />
                  )}

                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
                  >
                    <Heart
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        favorites.includes(recipe.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {recipe.tag && (
                    <span className="absolute bottom-3 left-3 bg-orange-100 text-orange-600 text-[10px] md:text-xs px-2 py-1 rounded-full font-medium">
                      {recipe.tag}
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
                      <p className="text-gray-400">Prot</p>
                      <p className="font-semibold text-gray-800">
                        {recipe.protein}g
                      </p>
                    </div>

                    <div className="bg-gray-100 rounded p-2">
                      <p className="text-gray-400">Carb</p>
                      <p className="font-semibold text-gray-800">--</p>
                    </div>

                    <div className="bg-gray-100 rounded p-2">
                      <p className="text-gray-400">Fat</p>
                      <p className="font-semibold text-gray-800">--</p>
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
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}