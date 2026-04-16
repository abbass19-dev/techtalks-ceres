const cards = [
  {
    step: "01",
    title: "Add Your Ingredients",
    description:
      "Manually enter your ingredients with quantities using our simple input form.",
  },
  {
    step: "02",
    title: "Get Nutrition Breakdown",
    description:
      "We instantly calculate calories, protein, carbs, fat, and fiber based on your ingredients.",
  },
  {
    step: "03",
    title: "Track & Improve",
    description:
      "Save your meals, monitor your nutrition, and stay on track with your health goals.",
  },
];

export default function ProcessCards() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6">
  {cards.map((card) => (
    <div
      key={card.step}
      className="group relative flex flex-col justify-between rounded-3xl bg-white px-8 py-10 md:py-12 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <span className="select-none text-[3rem] font-black leading-none text-[#006C49]/10">
        {card.step}
      </span>

      <div className="mb-4 mt-6">
        <h3 className="text-xl font-bold text-[#111827]">
          {card.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
          {card.description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 rounded-b-2xl bg-gradient-to-r from-[#006C49] to-[#00A859] transition-all duration-300 group-hover:w-full" />
    </div>
  ))}
</div>
  );
}
