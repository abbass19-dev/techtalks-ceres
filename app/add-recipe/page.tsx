"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {Utensils,Clock,BookOpen,ListOrdered,ImagePlus,Plus,X,ChevronDown,} from "lucide-react";
import {CATEGORIES,UNITS,RecipeForm,Ingredient,Instruction,createIngredient,createInstruction,initialRecipe,updateIngredientById,removeIngredientById,updateInstructionById,removeInstructionById,} from "@/lib/constants/recipeForm";

function useFoodSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/food/search?query=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setResults(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { results, loading };
}

export default function AddRecipePage() {
  const [recipe, setRecipe] = useState<RecipeForm>(initialRecipe);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    createIngredient(),
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    createInstruction(),
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openSearchId, setOpenSearchId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const activeIngredient =
    ingredients.find((item) => item.id === openSearchId) || null;

  const { results, loading: searchLoading } = useFoodSearch(
    activeIngredient?.name || "",
    openSearchId !== null
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setOpenSearchId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setRecipeField = (field: keyof RecipeForm, value: string) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const updateIngredient = (
    id: number,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredients((prev) => updateIngredientById(prev, id, field, value));
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, createIngredient()]);
  };

  const removeIngredient = (id: number) => {
    setIngredients((prev) => removeIngredientById(prev, id));
    if (openSearchId === id) {
      setOpenSearchId(null);
    }
  };

  const updateInstruction = (id: number, value: string) => {
    setInstructions((prev) => updateInstructionById(prev, id, value));
  };

  const addInstruction = () => {
    setInstructions((prev) => [...prev, createInstruction()]);
  };

  const removeInstruction = (id: number) => {
    setInstructions((prev) => removeInstructionById(prev, id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSelectSuggestion = (ingredientId: number, name: string) => {
    updateIngredient(ingredientId, "name", name);
    setOpenSearchId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!recipe.name || !recipe.description || !recipe.category || !recipe.servings || !recipe.prepTime || !recipe.cookTime) {
      setLoading(false);
      setError("Please fill in all recipe details");
      return;
    }
    const payload = {
      ...recipe,
      ingredients: ingredients.filter(
        (item) => item.name || item.quantity || item.unit
      ),
      instructions: instructions.filter((item) => item.text?.trim()),
      imagePreview,
    };

    console.log(payload);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess("Recipe saved successfully!");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f8faff] p-6 font-sans text-slate-900 lg:p-12">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <h1 className="mb-2 text-3xl font-bold text-[#1e293b] sm:text-4xl">
              Create New Recipe
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              Add your culinary masterpiece to the NutriGuide Digital Apothecary.
            </p>
          </header>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <Utensils className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Recipe Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Recipe Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Grilled Lemon Herb Chicken"
                      className="w-full rounded-xl bg-[#f0f4ff] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                      value={recipe.name}
                      onChange={(e) => setRecipeField("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="A brief overview of your recipe..."
                      className="w-full resize-none rounded-xl bg-[#f0f4ff] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                      value={recipe.description}
                      onChange={(e) =>
                        setRecipeField("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none rounded-xl bg-[#f0f4ff] px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-200"
                          value={recipe.category}
                          onChange={(e) =>
                            setRecipeField("category", e.target.value)
                          }
                        >
                          <option value="">Select Category</option>
                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Servings
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          placeholder="2"
                          className="w-full rounded-xl bg-[#f0f4ff] px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-blue-200"
                          value={recipe.servings}
                          onChange={(e) =>
                            setRecipeField("servings", e.target.value)
                          }
                        />
                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-slate-400">
                          People
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Ingredients</h2>
                  </div>

                  <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Row
                  </button>
                </div>

                <div className="space-y-4">
                  {ingredients.map((ingredient) => {
                    const isOpen = openSearchId === ingredient.id;

                    return (
                      <div
                        key={ingredient.id}
                        className="grid grid-cols-12 items-start gap-3"
                      >
                        <div
                          className="relative col-span-12 sm:col-span-6"
                          ref={isOpen ? searchBoxRef : null}
                        >
                          <input
                            type="text"
                            placeholder="Ingredient name..."
                            className="w-full rounded-xl bg-[#f0f4ff] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                            value={ingredient.name}
                            onChange={(e) => {
                              updateIngredient(
                                ingredient.id,
                                "name",
                                e.target.value
                              );
                              setOpenSearchId(ingredient.id);
                            }}
                            onFocus={() => {
                              if (ingredient.name.trim().length >= 2) {
                                setOpenSearchId(ingredient.id);
                              }
                            }}
                            autoComplete="off"
                          />

                          {isOpen && ingredient.name.trim().length >= 2 && (
                            <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                              {searchLoading && (
                                <div className="px-4 py-3 text-sm text-slate-400">
                                  Searching...
                                </div>
                              )}

                              {!searchLoading && results.length === 0 && (
                                <div className="px-4 py-3 text-sm text-slate-400">
                                  No results
                                </div>
                              )}

                              {!searchLoading &&
                                results.map((name, index) => (
                                  <button
                                    key={`${name}-${index}`}
                                    type="button"
                                    className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f0f4ff]"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleSelectSuggestion(
                                        ingredient.id,
                                        name
                                      );
                                    }}
                                  >
                                    {name}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        <div className="col-span-5 sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Qty"
                            className="w-full rounded-xl bg-[#f0f4ff] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              updateIngredient(
                                ingredient.id,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="col-span-6 flex items-center gap-2 sm:col-span-3">
                          <div className="relative flex-1">
                            <select
                              className="w-full appearance-none rounded-xl bg-[#f0f4ff] px-4 py-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                              value={ingredient.unit}
                              onChange={(e) =>
                                updateIngredient(
                                  ingredient.id,
                                  "unit",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Unit</option>
                              {Object.entries(UNITS).map(([label, units]) => (
                                <optgroup key={label} label={label}>
                                  {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          </div>

                          {ingredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIngredient(ingredient.id)}
                              className="shrink-0 text-slate-300 transition-colors hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2">
                      <ListOrdered className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Preparation Steps</h2>
                  </div>

                  <button
                    type="button"
                    onClick={addInstruction}
                    className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Step
                  </button>
                </div>

                <div className="space-y-6">
                  {instructions.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Describe this step..."
                        className="w-full flex-1 resize-none rounded-xl bg-[#f0f4ff] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                        value={step.text}
                        onChange={(e) =>
                          updateInstruction(step.id, e.target.value)
                        }
                      />

                      {instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(step.id)}
                          className="mt-2 text-slate-300 transition-colors hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8 lg:col-span-4 lg:sticky lg:top-8">
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Timing</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Prep Time
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        className="w-full rounded-xl bg-[#f0f4ff] px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-200"
                        value={recipe.prepTime}
                        onChange={(e) =>
                          setRecipeField("prepTime", e.target.value)
                        }
                      />
                      <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-slate-400">
                        min
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Cook Time
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        className="w-full rounded-xl bg-[#f0f4ff] px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-200"
                        value={recipe.cookTime}
                        onChange={(e) =>
                          setRecipeField("cookTime", e.target.value)
                        }
                      />
                      <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-slate-400">
                        min
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-100 bg-[#f0f4ff] p-8 text-center transition-all hover:bg-blue-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {imagePreview ? (
                  <div className="relative w-full overflow-hidden rounded-xl shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-red-500 backdrop-blur-sm hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-50 bg-white shadow-sm">
                      <ImagePlus className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mb-1 font-semibold text-slate-800">
                      Upload Cover Image
                    </h3>
                    <p className="text-xs text-slate-500">
                      Recommended size: 1200×1200px
                    </p>
                  </>
                )}

              </section>
              {error && (
                <p className="text-red-500 text-sm bg-red-100 p-2 rounded-[15px] text-center ">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 text-sm bg-green-100 p-2 rounded-[15px] text-center ">
                  {success}
                </p>
              )}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-xl bg-[#10b981] py-4 font-bold text-white shadow-lg shadow-green-100 transition-all active:scale-[0.98] hover:bg-[#059669] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Recipe"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl bg-white py-4 font-semibold text-slate-600 transition-all hover:bg-slate-50"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}