const testimonials = [
  {
    quote:
      "NutriGuide changed how I look at my morning smoothie. I didn't realize how much hidden sugar was in my 'healthy' routine until I used the analysis tool.",
    name: "Sarah Jenkins",
    role: "Certified Yoga Instructor",
    initials: "SJ",
  },
  {
    quote:
      "The historical tracking is a game-changer. Seeing the direct correlation between my macros and my gym recovery times has been invaluable.",
    name: "Marcus Thorne",
    role: "Amateur Triathlete",
    initials: "MT",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
            Loved by Health Enthusiasts
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Loved by Health Enthusiasts
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl border border-green-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm leading-7 text-slate-700 italic mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-sm font-semibold text-green-800">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
