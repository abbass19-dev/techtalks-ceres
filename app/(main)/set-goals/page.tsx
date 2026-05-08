"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetGoalsPage() {
  const router = useRouter();

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<{
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
  } | null>(null);

useEffect(() => {
  async function fetchGoals() {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();

      if (data?.goals) {
        setCalories(data.goals.dailyCalories || "");
        setProtein(data.goals.dailyProtein || "");
        setCarbs(data.goals.dailyCarbs || "");
        setFat(data.goals.dailyFat || "");
      }
      if (data?.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  }

  fetchGoals();
  }, []);

  const applyRecommendations = () => {
    if (!recommendations) return;
    setCalories(String(recommendations.dailyCalories));
    setProtein(String(recommendations.dailyProtein));
    setCarbs(String(recommendations.dailyCarbs));
    setFat(String(recommendations.dailyFat));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyCalories: calories,
          dailyProtein: protein,
          dailyCarbs: carbs,
          dailyFat: fat,
        }),
      });

      if (!res.ok) return;

      setMessage("Goals saved successfully!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error saving goals:", error);
    }
  };
  return (
    <>
      <div className="bg-[#F5F7F6] min-h-screen flex flex-col pb-20">
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2">
              Set Your Daily Goals
            </h1>

            <p className="text-gray-500 text-sm mb-6">
              Define your daily nutrition targets to track your progress.
            </p>

            {recommendations && (
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-emerald-900">
                  Suggested from your profile: {recommendations.dailyCalories} kcal,
                  {" "}{recommendations.dailyProtein}g protein,
                  {" "}{recommendations.dailyCarbs}g carbs,
                  {" "}{recommendations.dailyFat}g fat.
                </p>
                <button
                  type="button"
                  onClick={applyRecommendations}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  Use Suggestion
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories Goal
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder={calories}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein Goal (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder={protein}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbs Goal (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat Goal (g)
                </label>

                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="Enter fat goal"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col items-stretch sm:items-start gap-4">
              <button
                onClick={handleSubmit}
                className="bg-[#00A859] hover:bg-[#00964D] text-white px-8 py-4 rounded-xl text-sm font-semibold transition shadow-md active:scale-[0.98] w-full sm:w-auto"
              >
                Save Goals
              </button>

              {message && (
                <div className="mt-4 text-sm text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
