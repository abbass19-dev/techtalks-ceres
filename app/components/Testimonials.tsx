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
    <section className="bg-gray-50 px-20 py-20">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
        Loved by Health Enthusiasts
      </h2>

      <div className="grid grid-cols-2 gap-7">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white border border-green-100 rounded-2xl p-7"
          >
            <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
              "{t.quote}"
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-800 font-semibold text-sm">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}