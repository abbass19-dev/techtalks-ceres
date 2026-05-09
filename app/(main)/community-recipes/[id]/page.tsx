"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  FlaskConical,
  Heart,
  Leaf,
  Tag,
  Timer,
  Users,
  Utensils,
  ChefHat,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DashboardMeal } from "@/lib/utils/Types";

const round = (v?: number, d = 0) =>
  d === 0 ? Math.round(v ?? 0) : +(v ?? 0).toFixed(d);

export default function RecipeDetailsPage() {
  const { id } = useParams() as { id: string };

  const [recipe, setRecipe] = useState<DashboardMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch recipe");

        setRecipe(data.recipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);
  useEffect(() => {
    if (!id) return;

    const checkSaved = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) return;

        const userData = await userRes.json();
        const uid = userData?.user?.id;

        if (!uid) return;

        setUserId(uid);

        const savedRes = await fetch("/api/saved-recipes");
        const savedData = await savedRes.json();

        const saved = (savedData.saved || []).some(
          (s: { recipeId?: { _id?: string } }) =>
            s.recipeId?._id?.toString() === id,
        );

        setIsSaved(saved);
      } catch (err) {
        console.error("Failed to check saved recipe", err);
      } finally {
        setAuthChecked(true);
      }
    };

    checkSaved();
  }, [id]);
  const handleSaveToggle = async () => {
    if (!userId || !id) {
      alert("Please login first");
      return;
    }

    try {
      setSaving(true);

      if (isSaved) {
        await fetch(`/api/saved-recipes/${id}`, {
          method: "DELETE",
        });

        setIsSaved(false);
      } else {
        await fetch("/api/saved-recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipeId: id,
          }),
        });

        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to update saved recipe", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center flex-col gap-2">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Failed to load recipe</p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const n = recipe.nutritionPerServing ?? recipe.totalNutrition;

  const calories = round(n?.calories);
  const protein = round(n?.protein);
  const carbs = round(n?.carbs);
  const fat = round(n?.fat);

  const vitamins = [
    ["Vitamin A", round(n?.vitamins?.vitaminA, 1), "mcg"],
    ["Vitamin B", round(n?.vitamins?.vitaminB, 2), "mcg"],
    ["Vitamin C", round(n?.vitamins?.vitaminC, 1), "mg"],
    ["Vitamin D", round(n?.vitamins?.vitaminD, 1), "mcg"],
    ["Vitamin E", round(n?.vitamins?.vitaminE, 1), "mg"],
  ];

  const minerals = [
    ["Calcium", round(n?.minerals?.calcium, 1), "mg"],
    ["Iron", round(n?.minerals?.iron, 1), "mg"],
    ["Potassium", round(n?.minerals?.potassium, 1), "mg"],
    ["Magnesium", round(n?.minerals?.magnesium, 1), "mg"],
  ];

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  const isOwnRecipe = Boolean(userId && recipe.userId === userId);
  const canShowSave = authChecked && !isOwnRecipe;
  const quickStats: [LucideIcon, string, string | number | undefined][] = [
    [Clock, "Prep Time", `${recipe.prepTime ?? 0} min`],
    [Timer, "Cook Time", `${recipe.cookTime ?? 0} min`],
    [Users, "Servings", recipe.servings],
    [Tag, "Category", recipe.category],
  ];

  return (
    <main className="min-h-screen bg-[#F7F6F2]">
      <section className="relative w-full h-52 md:h-[500px] overflow-hidden bg-stone-900 ">
        {recipe.imageUrl && (
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            priority
            loading="eager"
            quality={75}
            className="object-cover object-center scale-[1] sm:scale-[1] md:object-[center_45%]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-emerald-300 bg-emerald-900/50 px-3 py-1 rounded-full mb-3">
              {recipe.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              {recipe.name}
            </h1>

            <p className="mt-2 text-white/75 text-sm md:text-base leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {canShowSave && (
            <button
              onClick={handleSaveToggle}
              disabled={saving}
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all ${
                isSaved ? "bg-rose-500 text-white" : "bg-white/90 text-gray-700"
              }`}
            >
              <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
              {saving ? "Saving..." : isSaved ? "Saved" : "Save"}
            </button>
          )}
        </div>
      </section>
      <section className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 md:px-8 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Icon size={14} className="text-emerald-600" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  {label}
                </p>

                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold">
                  Calories
                </p>

                <p className="text-5xl font-black">{calories}</p>

                <p className="text-sm text-emerald-100 mt-1">per serving</p>
              </div>

              <Flame size={52} className="text-white/20" />
            </div>

            <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-3 gap-3 text-center">
              {[
                ["Protein", protein],
                ["Carbs", carbs],
                ["Fat", fat],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-lg font-black">{value}g</p>

                  <p className="text-[10px] text-emerald-100 font-semibold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Leaf size={18} className="text-emerald-500" />
              Ingredients
            </h2>

            <ul className="divide-y divide-gray-50">
              {recipe.ingredients?.map((ing, i) => {
                const key = `${ing.name}-${i}`;
                const isChecked = checked.includes(key);

                return (
                  <li
                    key={key}
                    onClick={() =>
                      setChecked((prev) =>
                        prev.includes(key)
                          ? prev.filter((x) => x !== key)
                          : [...prev, key],
                      )
                    }
                    className={`flex justify-between items-center py-3 cursor-pointer ${
                      isChecked ? "opacity-40" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700">
                      {isChecked ? (
                        <CheckCircle2 size={15} className="text-emerald-500" />
                      ) : (
                        <Circle size={15} className="text-gray-300" />
                      )}

                      <span className={isChecked ? "line-through" : ""}>
                        {ing.name}
                      </span>
                    </span>

                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                      {ing.quantity} {ing.unit}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <FlaskConical size={18} className="text-sky-500" />
              Micronutrients
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">
                  Minerals
                </p>

                {minerals.map(([label, value, unit]) => (
                  <div
                    key={label}
                    className="flex justify-between py-2 border-b"
                  >
                    <span className="text-sm text-gray-600">{label}</span>

                    <span className="text-sm font-bold text-gray-900">
                      {value} {unit}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">
                  Vitamins
                </p>

                {vitamins.map(([label, value, unit]) => (
                  <div
                    key={label}
                    className="flex justify-between py-2 border-b"
                  >
                    <span className="text-sm text-gray-600">{label}</span>

                    <span className="text-sm font-bold text-gray-900">
                      {value} {unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <aside className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Utensils size={18} className="text-amber-500" />
              Preparation
            </h2>
            <ol className="space-y-6">
              {!recipe.instructions || recipe.instructions.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No instructions available...
                </p>
              ) : (
                recipe.instructions.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-bold text-gray-800">
                        {step.title}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ol>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <ChefHat size={18} className="text-emerald-500" />
              Quick Info
            </h2>

            {[
              ["Servings", recipe.servings],
              ["Prep Time", `${recipe.prepTime ?? 0} min`],
              ["Cook Time", `${recipe.cookTime ?? 0} min`],
              ["Total Time", `${totalTime} min`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b">
                <span className="text-xs text-gray-500 font-medium">
                  {label}
                </span>

                <span className="text-sm font-semibold text-gray-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
