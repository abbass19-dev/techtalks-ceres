import Image from "next/image";
import Link from "next/link";
import ProcessCards from "./components/ProcessCards";
import DoctorCards from "./components/DoctorCards";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f4f8fb] font-sans">
      <div className="relative flex min-h-dvh flex-col">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-landing.png"
            alt="Hero Background"
            fill
            priority
            className="object-cover object-[65%_60%] sm:object-[50%_60%] object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/20 via-white/40 to-[#f4f8fb] pointer-events-none" />
        </div>

        <header className="absolute top-0 left-0 z-50 w-full bg-linear-to-b from-white/90 to-white/30">
          <nav className="mx-auto flex h-17.5 w-full max-w-410 items-center justify-between px-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={70}
              className="object-contain"
            />
            <ul className="flex items-center gap-7 text-[15px]">
              <li className="group relative pb-1">
                <Link
                  href="/signin"
                  className="font-medium text-gray-700 transition-colors hover:text-[#00A859]"
                >
                  Login
                </Link>
                <div className="absolute bottom-0 left-0 h-0.75 w-0 rounded-b-2xl bg-linear-to-r from-[#006C49] to-[#00A859] transition-all duration-300 group-hover:w-full" />
              </li>
              <li>
                <Link
                  href="/signup"
                  className="mr-6 rounded-xl bg-[#00A859] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#00964D]"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <section className="relative z-10 mx-auto flex w-full max-w-360 flex-1 flex-col justify-center px-8 pt-32 pb-16">
          <div className="max-w-150">
            <h1 className="mb-6 text-5xl font-bold leading-[1.05] text-black sm:text-6xl md:text-[5rem]">
              Fuel Your <span className="text-[#006C49]">Journey</span> <br />
              with Precision.
            </h1>

            <p className="mb-10 max-w-105 text-[1.05rem] font-medium leading-relaxed text-gray-700 opacity-90 md:text-[1.15rem]">
              Instantly analyze any recipe and reach your health goals faster
              with the world&apos;s most advanced digital apothecary.
            </p>
            <Link href="/signup" className="inline-block">
              <button className="rounded-xl bg-[#00A859] px-8 py-3.5 text-[16px] font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00964D]">
                Start Now
              </button>
            </Link>
          </div>
        </section>
      </div>

      <section className="relative z-10 w-full bg-[#EFF4FF] px-8 pt-12 pb-24">
        <div className="mx-auto flex max-w-360 flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#006C49]">
              The Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] md:text-[2.2rem]">
              How it Works
            </h2>
          </div>

          <p className="max-w-[320px] text-[15px] font-medium leading-relaxed text-gray-700 md:text-right">
            Three simple steps to transform your relationship with food.
          </p>
        </div>
        <ProcessCards />
      </section>

      <section className="relative z-10 w-full bg-white px-8 pt-12 pb-32 md:px-3">
        <div className="mx-auto flex max-w-360 flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] md:text-[2.2rem]">
              Trusted by Experts
            </h2>
            <p className="max-w-[320px] text-[15px] font-medium leading-relaxed text-gray-700">
              Leading physicians and nutritionists share their insights on the
              power of food data.
            </p>
          </div>
        </div>
        <DoctorCards />
      </section>

      <Footer />
    </div>
  );
}