import Navbar from "../components/Navbar";
import { stats, balance, meals } from "./mockData";
import Footer from "../components/Footer";
import { Plus, Lightbulb } from "lucide-react";

export default function DashboardPage() {
  const statStyles = {
    Calories: {
      color: "text-[#111827]",
      bar: "bg-[#0E8A5F]",
    },
    Protein: {
      color: "text-[#16A34A]",
      bar: "bg-[#16A34A]",
    },
    Carbs: {
      color: "text-[#F59E0B]",
      bar: "bg-[#F59E0B]",
    },
    Fat: {
      color: "text-[#6B7280]",
      bar: "bg-[#6B7280]",
    },
    Fiber: {
      color: "text-[#B45309]",
      bar: "bg-[#B45309]",
    },
  };

  return (
    <div className="bg-[#F5F7F6] min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-10 px-4 md:px-6 lg:px-10 flex-1 space-y-6 max-w-[1400px] mx-auto pb-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">
              Welcome back, <span className="text-[#006C49]">Julian!</span>
            </h1>

            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Your nutritional synthesis for{" "}
              <span className="text-[#006C49] font-medium">
                Tuesday, Oct 24
              </span>{" "}
              is ready.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-[#00A859] hover:bg-[#00964D] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition flex items-center gap-2">
              <Plus size={16} />
              Analyze New Meal
            </button>

            <button className="bg-white text-black border border-gray-300 hover:border-[#00A859] hover:text-[#00A859] px-5 py-2.5 rounded-xl text-sm font-medium transition">
              Set Goals
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {stats.map((s) => {
            const style = statStyles[s.title];

            return (
              <div
                key={s.title}
                className="bg-white p-4 rounded-xl border border-gray-100 "
              >
                <p className="text-xs text-black uppercase tracking-wide">
                  {s.title}
                </p>

                <h2 className={`text-2xl font-semibold mt-1 ${style?.color}`}>
                  {s.value}
                </h2>

                <p className="text-xs text-gray-400">{s.target}</p>

                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                  <div
                    className={`${style?.bar} h-1.5 rounded-full`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[#111827] text-lg">
                Nutritional Balance Index
              </h2>

              <span className="text-xs bg-[#E6F4EC] text-[#006C49] px-3 py-1 rounded-full">
                Micronutrients
              </span>
            </div>

            {balance.map((item) => (
              <div key={item.label} className="mb-4">
                <div className="flex justify-between text-sm mb-1 text-gray-600">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>

                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div
                    className="bg-[#006C49] h-1.5 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}

            <p className="text-xs text-gray-400 mt-4">
              Your micro-nutrient balance is{" "}
              <span className="text-[#00A859] font-medium">optimal</span>.
              Focus on Calcium-rich foods for your next meal.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* RECENT MEALS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h2 className="font-semibold mb-4 text-[#111827]">
                Recent Meals
              </h2>

              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between py-3 border-b last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <img
  src={meal.image}
  alt={meal.name}
  className="w-10 h-10 rounded-lg object-cover"
/>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {meal.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {meal.type} • {meal.time}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm text-green-800">
                    {meal.calories} kcal
                  </span>
                </div>
              ))}

              <div className="flex justify-center">
                <button className="text-xs text-[#006C49] mt-3 font-medium transition hover:text-[#00A859] active:scale-95">
                  View All Activity
                </button>
              </div>
            </div>

            {/* DAILY TIP */}
            <div className="bg-gradient-to-br from-[#00A859] to-[#006C49] text-white p-6 rounded-2xl">
              
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={18} className="opacity-90" />
                <h2 className="font-semibold">Daily Tip</h2>
              </div>

              <p className="text-sm opacity-90">
                Fiber intake is crucial for gut health. Try adding chia seeds to
                your morning bowl.
              </p>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}