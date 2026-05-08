"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  Flame,
  ImagePlus,
  Layers3,
  Loader,
  Plus,
  Save,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  CATEGORIES,
  UNITS,
  createIngredient,
  createInstruction,
  removeIngredientById,
  removeInstructionById,
  updateIngredientById,
  updateInstructionById,
} from "@/lib/constants/recipeForm";
import type { Ingredient, Instruction, NutritionTotals } from "@/lib/utils/Types";
import { useFoodSearch } from "@/lib/hooks/useFoodSearch";

type RecipeFormState = {
  name: string;
  description: string;
  category: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  visibility: "public" | "private";
  status: "draft" | "published";
  imageUrl: string;
};

type RecipeIngredientResponse = {
  inputName?: string;
  name?: string;
  quantity?: number | string;
  unit?: string;
};

type RecipeInstructionResponse = {
  title?: string;
  description?: string;
};

type RecipeResponse = {
  name?: string;
  description?: string;
  category?: string;
  servings?: number | string;
  prepTime?: number | string;
  cookTime?: number | string;
  visibility?: "public" | "private";
  status?: "draft" | "published";
  imageUrl?: string;
  ingredients?: RecipeIngredientResponse[];
  instructions?: RecipeInstructionResponse[];
  nutritionPerServing?: NutritionTotals;
  totalNutrition?: NutritionTotals;
};

const emptyNutrition: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

const formatNumber = (value?: number) => Number(value || 0).toFixed(0);

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<RecipeFormState>({
    name: "",
    description: "",
    category: "",
    servings: "",
    prepTime: "",
    cookTime: "",
    visibility: "private",
    status: "draft",
    imageUrl: "",
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([createIngredient()]);
  const [instructions, setInstructions] = useState<Instruction[]>([createInstruction()]);
  const [nutrition, setNutrition] = useState<NutritionTotals>(emptyNutrition);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [openSearchId, setOpenSearchId] = useState<number | null>(null);

  const activeIngredient = ingredients.find((item) => item.id === openSearchId);
  const { results, loading: searchLoading } = useFoodSearch(
    activeIngredient?.name || "",
    openSearchId !== null,
  );

  const totalTime = useMemo(
    () => (Number(form.prepTime) || 0) + (Number(form.cookTime) || 0),
    [form.prepTime, form.cookTime],
  );

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!searchBoxRef.current?.contains(event.target as Node)) {
        setOpenSearchId(null);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();

        if (!res.ok || !data.recipe) {
          throw new Error(data.error || "Failed to fetch recipe");
        }

        const recipe = data.recipe as RecipeResponse;
        setForm({
          name: recipe.name || "",
          description: recipe.description || "",
          category: recipe.category || "",
          servings: String(recipe.servings || ""),
          prepTime: String(recipe.prepTime || ""),
          cookTime: String(recipe.cookTime || ""),
          visibility: recipe.visibility || "private",
          status: recipe.status || "draft",
          imageUrl: recipe.imageUrl || "",
        });

        setIngredients(
          recipe.ingredients?.length
            ? recipe.ingredients.map((item) => ({
                id: Date.now() + Math.floor(Math.random() * 100000),
                name: item.inputName || item.name || "",
                quantity: String(item.quantity || ""),
                unit: item.unit || "",
                selectedName: item.inputName || item.name || "",
              }))
            : [createIngredient()],
        );

        setInstructions(
          recipe.instructions?.length
            ? recipe.instructions.map((item) => ({
                id: Date.now() + Math.floor(Math.random() * 100000),
                title: item.title || "",
                description: item.description || "",
              }))
            : [createInstruction()],
        );
        setNutrition(recipe.nutritionPerServing || recipe.totalNutrition || emptyNutrition);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRecipe();
  }, [id]);

  function updateField(name: keyof RecipeFormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(file?: File) {
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const cleanIngredients = ingredients.filter(
      (item) => item.name.trim() || item.quantity.trim() || item.unit.trim(),
    );
    const unselectedIngredient = cleanIngredients.find(
      (item) => item.selectedName !== item.name,
    );
    const cleanInstructions = instructions
      .filter((item) => item.title.trim() || item.description.trim())
      .map((item, index) => ({
        step: index + 1,
        title: item.title.trim(),
        description: item.description.trim(),
      }));

    try {
      if (unselectedIngredient) {
        throw new Error(
          `Please select ${unselectedIngredient.name || "each ingredient"} from the ingredient search results`,
        );
      }

      const payload = {
        ...form,
        servings: Math.max(1, Number(form.servings) || 1),
        prepTime: Math.max(0, Number(form.prepTime) || 0),
        cookTime: Math.max(0, Number(form.cookTime) || 0),
        description: form.description.trim(),
        ingredients: cleanIngredients.map(({ name, quantity, unit }) => ({
          name,
          quantity,
          unit,
        })),
        instructions: cleanInstructions,
      };

      const body = new FormData();
      body.append("data", JSON.stringify(payload));
      if (imageFile) body.append("image", imageFile);

      const res = await fetch(`/api/recipes/${id}`, {
        method: "PATCH",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update recipe");
      }

      setMessage("Recipe updated successfully!");
      setTimeout(() => router.push("/my-recipes"), 700);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to update recipe");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] px-4 py-6 text-slate-900 lg:px-8">
      <main className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#006C49] text-white">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Edit Recipe</h1>
              <p className="mt-1 text-sm text-slate-500">
                Review the full recipe and update details, ingredients, steps, nutrition, and image.
              </p>
            </div>
          </div>

          <Link
            href="/my-recipes"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[460px] items-center justify-center rounded-2xl bg-white">
            <Loader className="h-7 w-7 animate-spin text-[#006C49]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <SectionTitle icon={BookOpen} title="Recipe Info" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Recipe Title" className="md:col-span-2">
                    <input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="field-input"
                      placeholder="Recipe name"
                    />
                  </Field>

                  <Field label="Category">
                    <Select value={form.category} onChange={(value) => updateField("category", value)}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Servings">
                    <input
                      type="number"
                      min="1"
                      value={form.servings}
                      onChange={(e) => updateField("servings", e.target.value)}
                      className="field-input"
                    />
                  </Field>

                  <Field label="Description" className="md:col-span-2">
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      className="field-input resize-none"
                      placeholder="Describe the dish..."
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <SectionTitle icon={Layers3} title="Ingredients" compact />
                  <button
                    type="button"
                    onClick={() => setIngredients((prev) => [...prev, createIngredient()])}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-[#006C49] hover:bg-emerald-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="grid grid-cols-12 gap-3">
                      <div
                        ref={openSearchId === ingredient.id ? searchBoxRef : null}
                        className="relative col-span-12 md:col-span-6"
                      >
                        <input
                          value={ingredient.name}
                          onChange={(e) => {
                            setIngredients(
                              updateIngredientById(
                                ingredients.map((item) =>
                                  item.id === ingredient.id
                                    ? { ...item, selectedName: "" }
                                    : item,
                                ),
                                ingredient.id,
                                "name",
                                e.target.value,
                              ),
                            );
                            setOpenSearchId(e.target.value.trim().length >= 2 ? ingredient.id : null);
                          }}
                          onFocus={() => ingredient.name.trim().length >= 2 && setOpenSearchId(ingredient.id)}
                          className="field-input"
                          placeholder="Ingredient"
                          autoComplete="off"
                        />

                        {openSearchId === ingredient.id && ingredient.name.trim().length >= 2 && (
                          <div className="absolute top-full z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-lg">
                            {searchLoading && <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>}
                            {!searchLoading && results.length === 0 && (
                              <div className="px-4 py-3 text-sm text-slate-400">No results</div>
                            )}
                            {!searchLoading &&
                              results.map((item, index) => (
                                <button
                                  key={`${item.name}-${index}`}
                                  type="button"
                                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-emerald-50"
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    setIngredients(
                                      updateIngredientById(
                                        ingredients.map((current) =>
                                          current.id === ingredient.id
                                            ? {
                                                ...current,
                                                selectedName: item.name,
                                              }
                                            : current,
                                        ),
                                        ingredient.id,
                                        "name",
                                        item.name,
                                      ),
                                    );
                                    setOpenSearchId(null);
                                  }}
                                >
                                  <div className="font-medium">{item.name}</div>
                                  {item.category && <div className="text-xs text-slate-400">{item.category}</div>}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>

                      <input
                        value={ingredient.quantity}
                        onChange={(e) =>
                          setIngredients(
                            updateIngredientById(ingredients, ingredient.id, "quantity", e.target.value),
                          )
                        }
                        className="field-input col-span-5 md:col-span-2"
                        placeholder="Qty"
                      />

                      <div className="col-span-6 md:col-span-3">
                        <Select
                          value={ingredient.unit}
                          onChange={(value) =>
                            setIngredients(updateIngredientById(ingredients, ingredient.id, "unit", value))
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
                        </Select>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          ingredients.length > 1 &&
                          setIngredients(removeIngredientById(ingredients, ingredient.id))
                        }
                        disabled={ingredients.length === 1}
                        className="col-span-1 flex h-11 items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <SectionTitle icon={BookOpen} title="Preparation Steps" compact />
                  <button
                    type="button"
                    onClick={() => setInstructions((prev) => [...prev, createInstruction()])}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-[#006C49] hover:bg-emerald-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {instructions.map((step, index) => (
                    <div key={step.id} className="flex gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006C49] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          value={step.title}
                          onChange={(e) =>
                            setInstructions(updateInstructionById(instructions, step.id, "title", e.target.value))
                          }
                          className="field-input"
                          placeholder="Step title"
                        />
                        <textarea
                          rows={3}
                          value={step.description}
                          onChange={(e) =>
                            setInstructions(
                              updateInstructionById(instructions, step.id, "description", e.target.value),
                            )
                          }
                          className="field-input resize-none"
                          placeholder="Step instructions"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          instructions.length > 1 &&
                          setInstructions(removeInstructionById(instructions, step.id))
                        }
                        disabled={instructions.length === 1}
                        className="mt-2 flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-emerald-50">
                  {imagePreview || form.imageUrl ? (
                    <Image
                      src={imagePreview || form.imageUrl}
                      alt={form.name || "Recipe"}
                      fill
                      sizes="360px"
                      className="object-cover"
                      unoptimized={Boolean(imagePreview)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#006C49]">
                      <ImagePlus className="h-12 w-12" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                  >
                    <Camera className="h-4 w-4" />
                    Change
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </div>
                <div className="space-y-3 p-4">
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className="field-input"
                    placeholder="Image URL"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <SectionTitle icon={Clock} title="Timing & Status" />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Prep min">
                      <input
                        type="number"
                        min="0"
                        value={form.prepTime}
                        onChange={(e) => updateField("prepTime", e.target.value)}
                        className="field-input"
                      />
                    </Field>
                    <Field label="Cook min">
                      <input
                        type="number"
                        min="0"
                        value={form.cookTime}
                        onChange={(e) => updateField("cookTime", e.target.value)}
                        className="field-input"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <Stat label="Total Time" value={`${totalTime} min`} />
                    <Stat label="Per Serving" value={`${formatNumber(nutrition.calories)} cal`} />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField("visibility", form.visibility === "public" ? "private" : "public")
                    }
                    className="flex h-12 w-full items-center justify-between rounded-xl bg-slate-50 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <span className="inline-flex items-center gap-2">
                      {form.visibility === "public" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      {form.visibility === "public" ? "Public" : "Private"}
                    </span>
                    <span
                      className={`h-6 w-11 rounded-full p-0.5 transition ${
                        form.visibility === "public" ? "bg-[#006C49]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`block h-5 w-5 rounded-full bg-white transition ${
                          form.visibility === "public" ? "translate-x-5" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <Select value={form.status} onChange={(value) => updateField("status", value)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <SectionTitle icon={Flame} title="Nutrition" />
                <div className="grid grid-cols-2 gap-3">
                  <NutritionStat label="Calories" value={nutrition.calories} />
                  <NutritionStat label="Protein" value={nutrition.protein} suffix="g" />
                  <NutritionStat label="Carbs" value={nutrition.carbs} suffix="g" />
                  <NutritionStat label="Fat" value={nutrition.fat} suffix="g" />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Nutrition refreshes after saving ingredient changes.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#006C49] px-5 text-sm font-bold text-white hover:bg-[#00563B] disabled:opacity-60"
                >
                  {saving ? <Loader className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                {message && (
                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {message}
                  </div>
                )}
              </section>
            </aside>
          </form>
        )}
      </main>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "mb-5"}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#006C49]">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input appearance-none pr-10"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}

function NutritionStat({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value?: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-900">
        {formatNumber(value)}
        {suffix}
      </div>
    </div>
  );
}
