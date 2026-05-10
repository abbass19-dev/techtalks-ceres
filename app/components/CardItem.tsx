import { Clock, Eye, FileText, Flame, Lock, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/lib/utils/Types";
import RecipeImage from "./RecipeImage";

function formatMacro(value: number) {
  return Number(value || 0).toFixed(value % 1 === 0 ? 0 : 1);
}

function CardItem({
  recipe,
  priority = false,
  href,
}: {
  recipe: Recipe;
  priority?: boolean;
  href?: string;
}) {
  const router = useRouter();
  const targetHref = href || `/community-recipes/${recipe.id}`;
  const isDraft = recipe.status === "draft";
  const isPublic = recipe.visibility === "public";
  const hasStatus = Boolean(recipe.status);
  const hasVisibility = Boolean(recipe.visibility);

  return (
    <article
      className="group/card cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
      onClick={() => router.push(targetHref)}
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <RecipeImage
          src={recipe.image || "/images/salad.jpeg"}
          alt={recipe.title}
          fill
          className="object-cover transition duration-500 group-hover/card:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {recipe.category && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
              {recipe.category}
            </span>
          )}
          {hasStatus && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur ${
                isDraft ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {isDraft ? <FileText className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {isDraft ? "Draft" : "Published"}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-white drop-shadow">
              {recipe.title}
            </h3>
          </div>
          {hasVisibility && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 backdrop-blur">
              {isPublic ? <Eye className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {isPublic ? "Public" : "Private"}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <Flame className="h-3.5 w-3.5" />
              Calories
            </p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {Math.round(recipe.calories)}
              <span className="ml-1 text-xs font-semibold text-slate-500">kcal</span>
            </p>
          </div>

          <div className="rounded-xl bg-sky-50 px-3 py-2">
            <p className="flex items-center gap-1 text-xs font-semibold text-sky-700">
              <Clock className="h-3.5 w-3.5" />
              Time
            </p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {recipe.timeToCook || 0}
              <span className="ml-1 text-xs font-semibold text-slate-500">min</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Protein", `${formatMacro(recipe.protein)}g`],
            ["Carbs", `${formatMacro(recipe.carbs)}g`],
            ["Fat", `${formatMacro(recipe.fat)}g`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-2 py-2">
              <p className="text-[11px] font-semibold text-slate-500">{label}</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Utensils className="h-4 w-4 text-emerald-600" />
            Per serving
          </span>
          <span className="text-sm font-bold text-emerald-700">Open</span>
        </div>
      </div>
    </article>
  );
}

export default CardItem;
