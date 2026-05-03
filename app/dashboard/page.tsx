"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus, Lightbulb, Trash2, AlertTriangle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NavbarUser, DashboardMeal, DailyNutrientIntake } from "@/lib/utils/Types";
import { dayName } from "@/lib/utils/plannerUtils";
import { getNutrientColor } from "@/lib/utils/nutrientCalculator";
import { EMPTY_TOTALS, STAT_STYLES, DEFAULT_GOALS, buildBalance, buildStats, getDailyRandomTip } from "@/lib/constants/dashboard";
import type { NutritionTotals, BalanceItem, StatItem } from "@/lib/utils/Types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [meals, setMeals] = useState<DashboardMeal[]>([]);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [goals, setGoals] = useState<typeof DEFAULT_GOALS | null>(null);
  const [totals, setTotals] = useState<NutritionTotals>(EMPTY_TOTALS);
  const [nutrientPercentages, setNutrientPercentages] =
    useState<DailyNutrientIntake | null>(null);
  const tipOfDay = getDailyRandomTip();

  const multiplier = period === "month" ? 30 : 7;
  const g = goals || DEFAULT_GOALS;
  const overGoals = {
    calories: totals.calories > g.dailyCalories * multiplier,
    protein: totals.protein > g.dailyProtein * multiplier,
    carbs: totals.carbs > g.dailyCarbs * multiplier,
    fat: totals.fat > g.dailyFat * multiplier,
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            image: data.user.image || "/images/logo.png",
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([fetch(`/api/dashboard?period=${period}`), fetch("/api/goals")])
      .then(async ([dashRes, goalsRes]) => {
        if (!dashRes.ok || !goalsRes.ok) return;
        const dash = await dashRes.json();
        const goalsData = await goalsRes.json();
        setTotals(dash.totals || EMPTY_TOTALS);
        setNutrientPercentages(dash.nutrientPercentages || null);
        setMeals(dash.recipes || []);
        setGoals(goalsData.goals || null);
      })
      .catch(() => {});
  }, [period]);

  const balance: BalanceItem[] = useMemo(
    () => (nutrientPercentages ? buildBalance(nutrientPercentages) : []),
    [nutrientPercentages],
  );
  const stats: StatItem[] = useMemo(
    () => buildStats(totals, goals, period),
    [totals, goals, period],
  );

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/weekly-planner/${id}`, {
      method: "DELETE",
    }).catch(() => null);
    if (res?.ok) setMeals((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="bg-[#F5F7F6] min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-6 px-4 md:px-6 lg:px-10 flex-1 space-y-6 w-full mx-auto pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight">
              Welcome back,{" "}
              <span className="text-[#006C49]">
                {user?.firstName || "Friend"}!
              </span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Your nutritional synthesis for{" "}
              <span className="text-[#006C49] font-medium">
                {period === "week"
                  ? dayName
                  : new Date().toLocaleString("default", { month: "long" })}
              </span>{" "}
              is ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => router.push("/analyze-meal")}
              className="bg-[#00A859] hover:bg-[#00964D] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Analyze New Meal
            </button>
            <Link
              href="/set-goals"
              className="bg-white text-gray-700 border border-gray-200 hover:border-[#00A859] hover:text-[#00A859] px-6 py-3 rounded-xl text-sm font-semibold transition shadow-sm flex items-center justify-center"
            >
              Set Goals
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-600">View:</span>

          <div className="relative flex w-[200px] bg-gray-100 rounded-lg p-1">
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-white shadow-sm transition-all duration-300 ease-in-out ${
                period === "week" ? "left-1" : "left-[calc(50%+2px)]"
              }`}
            />

            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`relative z-10 flex w-1/2 items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  period === p
                    ? "text-[#006C49]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {p === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s) => {
            const style = STAT_STYLES[s.title];
            const isOver =
              overGoals[s.title.toLowerCase() as keyof typeof overGoals];
            return (
              <div
                key={s.title}
                className="bg-white p-4 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={16} className={style.color} />
                  <p className="text-xs text-black uppercase tracking-wide">
                    {s.title}
                  </p>
                </div>
                <h2 className={`text-2xl font-semibold mt-1 ${style.color}`}>
                  {s.value}
                </h2>
                <p className="text-xs text-gray-400">{s.target}</p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                  <div
                    className={`${style.bar} h-1.5 rounded-full`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
                {isOver ? (
                  <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">
                    <AlertTriangle size={12} /> Over goal
                  </span>
                ) : (
                  <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                    <Check size={12} /> On track
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-semibold text-[#111827] text-lg">
                  {period === "month" ? "Monthly" : "Weekly"} Nutritional
                  Balance Index
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {balance.filter((b) => b.value >= 100).length} of{" "}
                  {balance.length} nutrients meeting daily goal
                </p>
              </div>
              <span className="text-xs bg-[#E6F4EC] text-[#006C49] px-3 py-1 rounded-full font-medium">
                Micronutrients • {period === "month" ? "Month" : "Week"}
              </span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b">
                  <th className="text-left pb-3 font-medium tracking-wide">
                    Nutrient
                  </th>
                  <th className="text-right pb-3 font-medium tracking-wide hidden sm:table-cell">
                    Amount
                  </th>
                  <th
                    className="pb-3 font-medium tracking-wide"
                    style={{ width: "45%" }}
                  >
                    <span className="float-right">% Daily Value</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {balance.map(({ label, icon: Icon, amount, unit, value }) => (
                  <tr
                    key={label}
                    className="border-b last:border-none group hover:bg-[#F9FDFB] transition-colors"
                  >
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2.5 text-gray-700">
                        <span className="w-7 h-7 rounded-full bg-[#E6F4EC] flex items-center justify-center flex-shrink-0 group-hover:bg-[#d3ede0] transition-colors">
                          <Icon size={13} className="text-[#006C49]" />
                        </span>
                        <span className="font-medium text-[#111827]">
                          {label}
                        </span>
                      </div>
                    </td>
                    <td className="text-right text-gray-500 tabular-nums pr-4 hidden sm:table-cell">
                      <span className="font-medium text-gray-700">
                        {amount.toFixed(1)}
                      </span>
                      <span className="text-gray-400 ml-1 text-xs">{unit}</span>
                    </td>
                    <td className="py-3" style={{ width: "45%" }}>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="flex-1 max-w-[120px] bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`${getNutrientColor(value)} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(value, 100)}%` }}
                          />
                        </div>
                        <span
                          className={`inline-block min-w-[56px] text-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            value >= 100
                              ? "bg-green-100 text-green-700"
                              : value >= 50
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-50 text-red-500"
                          }`}
                        >
                          {value.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-[#111827]">
                  {period === "month" ? "Monthly" : "Weekly"} Planner Meals
                </h2>
                {meals.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {meals.length} meals
                  </span>
                )}
              </div>

              {meals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400 mb-3">
                    No meals in your planner yet.
                  </p>
                  <Link
                    href="/weekly-planner"
                    className="text-xs text-[#006C49] font-medium hover:text-[#00A859] transition"
                  >
                    Go to Weekly Planner →
                  </Link>
                </div>
              ) : (
                <>
                  {meals.slice(0, 3).map((meal) => (
                    <div
                      key={meal._id}
                      className="flex items-center justify-between py-3 border-b last:border-none"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={meal.image || "/images/logo.png"}
                          alt={meal.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {meal.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {meal.category || "Meal"} •{" "}
                            {Math.round(meal.nutritionPerServing?.protein || 0)}
                            g protein
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-800">
                          {Math.round(meal.nutritionPerServing?.calories || 0)}{" "}
                          kcal
                        </span>
                        <button
                          onClick={() => handleDelete(meal._id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/weekly-planner"
                    className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-[#006C49] hover:text-[#00A859] border border-[#006C49] hover:border-[#00A859] rounded-xl py-2.5 transition"
                  >
                    {meals.length > 3
                      ? `View All ${meals.length} Meals in Planner`
                      : "View in Weekly Planner"}
                  </Link>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#00A859] to-[#006C49] text-white p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={18} />
                <h2 className="font-semibold">Daily Tip</h2>
              </div>
              <p className="text-sm opacity-90">{tipOfDay}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
