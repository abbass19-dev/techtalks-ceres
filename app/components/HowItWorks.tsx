import Image from "next/image";

const steps = [
  {
    number: "1",
    title: "Input Your Food",
    description:
      "Scan a barcode, take a photo, or manually enter your meal ingredients into our intelligent parser.",
  },
  {
    number: "2",
    title: "Molecular Analysis",
    description:
      "Our engine cross-references millions of data points to identify vitamins, minerals, and harmful additives.",
  },
  {
    number: "3",
    title: "Actionable Insights",
    description:
      "Receive custom recommendations based on your unique body goals and nutritional needs.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 px-20 py-20">
      <div className="grid grid-cols-2 gap-16 items-center">

        {/* Left Image */}
        <div className="relative w-full h-80 rounded-2xl overflow-hidden">
          <Image
            src="/images/how-it-works.png"
            alt="How NutriGuide works"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            How NutriGuide Works
          </h2>
          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-1">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}