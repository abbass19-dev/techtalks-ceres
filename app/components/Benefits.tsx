const benefits = [
  {
    icon: "♡",
    title: "Better Long-term Health",
    description:
      "Reduce inflammation and improve longevity by understanding exactly what fuel you're providing your cells.",
  },
  {
    icon: "🚀",
    title: "Peak Performance",
    description:
      "Whether you're training for a marathon or a boardroom meeting, align your diet with your energy needs.",
  },
  {
    icon: "🏆",
    title: "Goal Achievement",
    description:
      "Stop guessing and start measuring. Data-driven nutrition makes hitting your body composition targets inevitable.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white px-20 py-20 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-12">
        Why Choose NutriGuide
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-gray-50 border border-green-100 rounded-2xl px-7 py-8 text-center"
          >
            <div className="w-11 h-11 rounded-full border-2 border-green-400 flex items-center justify-center mx-auto mb-5 text-xl text-green-700">
              {benefit.icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}