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
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
            Why Choose NutriGuide
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why Choose NutriGuide
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-3xl border border-green-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-2xl shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-sm leading-7 text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
