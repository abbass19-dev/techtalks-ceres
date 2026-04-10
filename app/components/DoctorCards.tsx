const doctors = [
  {
    name: "Dr. Michael Greger",
    title: "Physician, Nutrition Expert",
    quote:
      "Understanding what we eat is the foundation of good health. Tools that analyze food can improve long-term wellbeing.",
  },
  {
    name: "Dr. Walter Willett",
    title: "Harvard School of Public Health",
    quote:
      "Diet plays a crucial role in preventing diseases. Making nutrition data accessible empowers healthier choices.",
  },
  {
    name: "Dr. David Katz",
    title: "Preventive Medicine Specialist",
    quote:
      "Food is medicine. When people understand their diet, they gain control over their health.",
  },
];

export default function DoctorCards() {
  return (
    <div className="mt-12 grid w-full grid-cols-1 gap-6 px-7 mx-auto lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {doctors.map((doc, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between rounded-2xl bg-white px-8 py-15  shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <p className="text-[15px] italic leading-relaxed max-w-[450px] text-gray-700">
            "{doc.quote}"
          </p>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-[#00A859]">{doc.name}</h3>
            <p className="text-sm font-medium text-gray-500">{doc.title}</p>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-2xl bg-gradient-to-r from-[#006C49] to-[#00A859]" />
        </div>
      ))}
    </div>
  );
}
