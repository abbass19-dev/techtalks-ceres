"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetGoalsPage() {
  const router = useRouter();

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    if (!calories || !protein || !carbs || !fat || !fiber) {
      setMessage("Please fill all fields");
      return;
    }

    const goals = {
      calories,
      protein,
      carbs,
      fat,
      fiber,
    };

    localStorage.setItem("goals", JSON.stringify(goals));

    setMessage("Goals saved! Redirecting...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="bg-[#F5F7F6] min-h-screen flex flex-col pb-20">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2">
            Set Goals
          </h1>

          <p className="text-gray-500 text-sm mb-6">
            Set your nutrition targets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories Goal
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 2500"
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
                placeholder="e.g. 160"
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
                placeholder="e.g. 70"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiber Goal (g)
              </label>
              <input
                type="number"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                placeholder="e.g. 35"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00A859] text-black placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-3">
            <button
              onClick={handleSave}
              className="bg-[#00A859] hover:bg-[#00964D] text-white px-6 py-3 rounded-xl text-sm font-medium transition"
            >
              Save Goals
            </button>

            {message && (
              <p
                className={`text-sm ${
                  message.includes("saved")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
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