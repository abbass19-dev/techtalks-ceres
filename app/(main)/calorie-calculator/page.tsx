"use client";

import { useState } from "react";
import { calculateCalories } from "@/lib/utils/calculatorUtils";
import { CalculatorResults } from "@/lib/utils/Types";
import { Activity, Flame, Target, Info } from "lucide-react";

export default function CalorieCalculatorPage() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
    targetDate: "",
    activity: "",
    goal: "",
  });

  const [result, setResult] = useState<CalculatorResults | null>(null);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();

    const age = Number(formData.age);
    const height = Number(formData.height);
    const weight = Number(formData.weight);
    const goalWeight = formData.goalWeight
      ? Number(formData.goalWeight)
      : undefined;

    if (
      !formData.gender ||
      !formData.activity ||
      !formData.age ||
      !formData.height ||
      !formData.weight ||
      !formData.goal
    ) {
      setResult(null);
      setError("Please fill in all required fields.");
      return;
    }

    if (age <= 0 || height <= 0 || weight <= 0) {
      setResult(null);
      setError("Please enter valid numbers.");
      return;
    }

    if (
      formData.goal === "lose" &&
      goalWeight !== undefined &&
      goalWeight >= weight
    ) {
      setResult(null);
      setError("Goal weight must be lower than your current weight.");
      return;
    }

    if (
      formData.goal === "gain" &&
      goalWeight !== undefined &&
      goalWeight <= weight
    ) {
      setResult(null);
      setError("Goal weight must be higher than your current weight.");
      return;
    }

    if (formData.targetDate) {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        setResult(null);
        setError("Target date must be in the future.");
        return;
      }
    }

    const results = calculateCalories({
      gender: formData.gender as "male" | "female",
      age,
      height,
      weight,
      activity: formData.activity as
        | "sedentary"
        | "light"
        | "moderate"
        | "active",
      goal: formData.goal as "lose" | "maintain" | "gain",
      goalWeight,
      targetDate: formData.targetDate || undefined,
    });

    setResult(results);
    setError("");
    if (formData.targetDate) {
      const selected = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        setError("Date must be today or in the future");
        return;
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FF]">
      <div className="flex flex-1 justify-center px-4 py-4">
        <div className="w-full max-w-[1400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              Calorie Calculator
            </h1>
            <p className="mt-2 text-sm text-[#64748B] md:text-base">
              Input your details below to calculate your
              <br className="hidden sm:block" />
              daily energy requirements based on your health goals.
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 items-start">
            <form
              className="rounded-2xl bg-white p-4 shadow-lg md:p-6"
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            >
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="flex justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Male
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="flex justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Female
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="age"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      id="age"
                      value={formData.age}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="Enter your age"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="height"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={formData.height}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={3}
                      placeholder="Enter your height"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value
                          .replace(/\D/g, "")
                          .slice(0, 3);
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="weight"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Enter your weight"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="goalWeight"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Goal Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="goalWeight"
                      id="goalWeight"
                      value={formData.goalWeight}
                      onChange={handleChange}
                      placeholder="Enter your goal weight"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="targetDate"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="targetDate"
                    id="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Activity Level
                  </label>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        value="sedentary"
                        checked={formData.activity === "sedentary"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="grid justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Sedentary
                        <span className="mt-2 text-[11px] text-[#94A3B8]">
                          Little/No Exercise
                        </span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        value="light"
                        checked={formData.activity === "light"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="grid justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Light
                        <span className="mt-2 text-[11px] text-[#94A3B8]">
                          1-3 days/week
                        </span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        value="moderate"
                        checked={formData.activity === "moderate"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="grid justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Moderate
                        <span className="mt-2 text-[11px] text-[#94A3B8]">
                          3-5 days/week
                        </span>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        value="active"
                        checked={formData.activity === "active"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="grid justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Active
                        <span className="mt-2 text-[11px] text-[#94A3B8]">
                          Daily Exercise
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Goal
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="goal"
                        value="lose"
                        checked={formData.goal === "lose"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="flex justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Lose
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="goal"
                        value="maintain"
                        checked={formData.goal === "maintain"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="flex justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Maintain
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="goal"
                        value="gain"
                        checked={formData.goal === "gain"}
                        onChange={handleChange}
                        className="peer hidden"
                      />
                      <div className="flex justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#0D1C2E] transition hover:border-green-400 hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-100 peer-checked:text-green-700">
                        Gain
                      </div>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-red-100 bg-red-50/50 px-4 py-3 text-sm font-bold text-red-600">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-1 w-full cursor-pointer rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Calculate
                </button>
              </div>
            </form>

            <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6 h-fit">
              <h2 className="text-lg font-bold text-[#0D1C2E] mb-4">Results</h2>

              {!result ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Info size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Fill in your details and click calculate
                    <br /> to see your results.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col rounded-2xl bg-blue-50/50 p-5 border border-blue-100/50 transition-all hover:bg-blue-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <Activity size={20} />
                        </div>
                        <p className="text-sm font-bold text-blue-900/70">
                          BMR
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-black text-blue-900">
                          {result.bmr}
                        </p>
                        <span className="text-sm font-bold text-blue-900/40">
                          kcal/day
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-blue-900/40 italic">
                        Energy burned at rest
                      </p>
                    </div>

                    <div className="flex flex-col rounded-2xl bg-orange-50/50 p-5 border border-orange-100/50 transition-all hover:bg-orange-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                          <Flame size={20} />
                        </div>
                        <p className="text-sm font-bold text-orange-900/70">
                          Maintenance
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-black text-orange-900">
                          {result.calories}
                        </p>
                        <span className="text-sm font-bold text-orange-900/40">
                          kcal/day
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-orange-900/40 italic">
                        To maintain current weight
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl bg-green-600 p-6 shadow-xl shadow-green-200 md:p-8">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/20 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-green-400/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                        <Target size={24} />
                      </div>

                      <p className="mx-auto max-w-[280px] text-xs font-bold leading-relaxed text-green-50 uppercase tracking-wider opacity-80">
                        {formData.targetDate && formData.goalWeight
                          ? "Target Daily Intake"
                          : "Recommended Daily Intake"}
                      </p>

                      <div className="mt-4 flex flex-col items-center">
                        <div className="flex items-baseline gap-2">
                          <p className="text-6xl font-black tracking-tighter text-white">
                            {result.goalCalories}
                          </p>
                          <span className="text-xl font-black text-green-200">
                            Kcal
                          </span>
                        </div>
                        {formData.targetDate && formData.goalWeight && (
                          <p className="mt-2 text-[11px] font-bold text-green-100/80">
                            to reach {formData.goalWeight}kg by{" "}
                            {new Date(formData.targetDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {result.floorHit && (
                        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-black/20 p-4 text-left text-[11px] text-white/90 backdrop-blur-sm border border-white/10">
                          <Info
                            size={16}
                            className="mt-0.5 shrink-0 text-amber-300"
                          />
                          <div>
                            <p className="font-bold text-amber-300">
                              Safety Floor Applied
                            </p>
                            <p className="mt-1 leading-normal opacity-90">
                              We&apos;ve set your intake to a safe minimum of{" "}
                              {formData.gender === "male" ? "1500" : "1200"}{" "}
                              kcal. Rapid weight loss can be unhealthy.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
