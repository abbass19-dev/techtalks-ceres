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
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
              How NutriGuide Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How NutriGuide Works
            </h2>
            <p className="max-w-xl text-base leading-8 text-slate-600">
              Capture every meal, dive into the science, and use data-driven
              recommendations to improve your nutrition one plate at a time.
            </p>
          </div>
          <div className="relative hidden w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-white shadow-sm sm:block sm:h-[260px] md:max-w-[620px] md:h-[320px]">
            <Image
              src="/images/how.png"
              alt="How NutriGuide works"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-sm font-semibold text-white">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
