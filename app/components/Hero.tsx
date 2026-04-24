import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pt-8 pb-14 sm:px-6 sm:pt-12 lg:grid-cols-2 lg:gap-12 lg:pt-16 lg:pb-20 lg:px-8">
        <div className="order-2 space-y-5 md:order-1 md:space-y-6">
          <h1 className="max-w-70 text-[1.9rem] font-bold leading-[1.08] tracking-tight text-slate-900 min-[380px]:max-w-80 min-[380px]:text-[2.15rem] sm:max-w-xl sm:text-5xl lg:text-6xl">
            Understand Your Food,{" "}
            <span className="text-green-600">Fuel Your Life</span>
          </h1>

          <p className="max-w-[320px] text-sm leading-6 text-slate-500 sm:max-w-md sm:text-base sm:leading-7">
            Turn any recipe or ingredient list into a detailed nutritional
            profile. Science-backed insights to help you eat smarter, not
            harder.
          </p>

          <div className="flex flex-col gap-3 min-[420px]:flex-row">
            <Link
              href="/add-recipe"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Start Analysis
            </Link>

            <Link
              href="/community-recipes"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-green-50 px-5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              Explore Features
            </Link>
          </div>
        </div>

        <div className="order-1 hidden md:order-2 lg:block">
          <div className="relative mx-auto w-full max-w-85 sm:max-w-105 md:ml-auto md:mr-0 md:max-w-115">
            <div className="relative h-62.5 overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:h-80 md:h-90 lg:h-97.5">
              <Image
                src="/images/hero-food.png"
                alt="Healthy salad bowl"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-5 left-3 z-10 rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-[0_16px_35px_rgba(15,23,42,0.12)] sm:left-5 sm:px-4 sm:py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-base sm:h-11 sm:w-11">
                  ⚡
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    Current Energy
                  </p>
                  <p className="text-sm font-semibold text-slate-900 sm:text-base">
                    2,450 kcal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
