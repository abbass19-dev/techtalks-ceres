"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeMealPage() {
  const router = useRouter();

  const [mealName, setMealName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [message, setMessage] = useState("");

  const handleAnalyze = () => {
    if (!mealName || !category || !ingredients) {
      setMessage("Please fill all required fields.");
      return;
    }

    // 🔥 create new meal
    const newMeal = {
      id: Date.now(),
      name: mealName,
      calories: 500,
      type: category,
      time: "Now",
      image: "/images/salad.jpeg",
    };

    // 🧠 get existing meals
    const existingMeals =
      JSON.parse(localStorage.getItem("meals") || "[]");

    // 💾 save
    localStorage.setItem(
      "meals",
      JSON.stringify([newMeal, ...existingMeals])
    );

    // ✅ show success
    setMessage("Meal added successfully! Redirecting...");

    // ⏳ بعد 1 ثانية ارجع للـ dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="bg-[#F5F7F6] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2">
            Analyze New Meal
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Fill in the meal details below.
          </p>

          {/* FORM */}
          <div className="space-y-5">

            {/* Meal Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Name
              </label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Chicken Bowl"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Lunch"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] resize-none text-black placeholder:text-gray-400"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. Chicken, rice, avocado..."
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] resize-none text-black placeholder:text-gray-400"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleAnalyze}
              className="bg-[#00A859] hover:bg-[#00964D] text-white px-6 py-3 rounded-xl text-sm font-medium transition"
            >
              Analyze Meal
            </button>

            {/* MESSAGE */}
            {message && (
              <p className="text-green-600 text-sm mt-2">
                {message}
              </p>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}