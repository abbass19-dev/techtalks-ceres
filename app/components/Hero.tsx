import Image from "next/image";

export default function Hero() {
  return (
    <section className="grid grid-cols-2 gap-10 px-20 py-20 bg-white items-center min-h-[480px]">

      {/* Left Content */}
      <div>
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200 mb-5">
          ● Science-Backed Nutrition
        </div>

        <h1 className="text-5xl font-bold leading-tight text-gray-900 mb-4">
          Understand Your Food,{" "}
          <span className="text-green-700">Fuel Your Life</span>
        </h1>

        <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
          Turn any recipe or ingredient list into a detailed nutritional
          profile. Science-backed insights to help you eat smarter, not harder.
        </p>

        <div className="flex gap-4">
          <button className="bg-green-700 text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
            Start Analysis
          </button>
          <button className="border border-green-700 text-green-700 px-7 py-3 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            Explore Features
          </button>
        </div>
      </div>

      {/* Right Image + Badge */}
      <div className="relative flex justify-center">

        {/* Salad Image */}
        <div className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden">
          <Image
         src="/images/hero-food.png"
          alt="Healthy salad bowl"
         fill
         loading="eager"
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
/>
        </div>

        {/* Calorie Badge */}
        <div className="absolute bottom-6 left-4 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700">
            ⚡
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              Current Energy
            </p>
            <p className="text-base font-semibold text-gray-900">2,450 kcal</p>
          </div>
        </div>

      </div>

    </section>
  );
}