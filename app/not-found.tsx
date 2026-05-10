import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.22),transparent_28%),linear-gradient(180deg,#050816,#020617)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-12">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-300 backdrop-blur">
            Error 404 · Page not found
          </div>

          <h1 className="text-7xl font-black tracking-tight sm:text-8xl lg:text-9xl">
            Lost in
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Space
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            The page you are looking for does not exist, was moved, or the link
            is broken. Let’s get you back to the main dashboard.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.35)] transition hover:-translate-y-1 hover:bg-emerald-300"
            >
              <Home size={18} />
              Back Home
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
            >
              <Search size={18} />
              Go Dashboard
            </Link>
          </div>
        </div>

        <div className="relative mx-auto hidden h-[520px] w-full max-w-lg lg:block">
          <div className="absolute right-8 top-8 h-36 w-36 rounded-full bg-slate-200 shadow-[0_0_80px_rgba(255,255,255,0.45)]">
            <span className="absolute left-8 top-8 h-5 w-5 rounded-full bg-slate-300" />
            <span className="absolute right-8 top-14 h-8 w-8 rounded-full bg-slate-300" />
            <span className="absolute bottom-8 left-16 h-4 w-4 rounded-full bg-slate-300" />
          </div>

          <div className="absolute left-8 top-24 h-2 w-2 rounded-full bg-white shadow-[120px_80px_0_white,260px_20px_0_white,320px_200px_0_white,60px_300px_0_white]" />

          <div className="absolute bottom-8 left-1/2 h-72 w-56 -translate-x-1/2 animate-float">
            <div className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full border-[6px] border-white bg-slate-200 shadow-xl">
              <div className="absolute left-5 top-8 h-12 w-16 rounded-b-full rounded-t-2xl bg-slate-900">
                <span className="absolute right-3 top-3 h-2 w-6 rounded-full bg-white/60" />
              </div>
            </div>

            <div className="absolute left-1/2 top-24 h-36 w-36 -translate-x-1/2 rounded-[2rem] bg-white shadow-2xl">
              <div className="absolute left-1/2 top-6 h-14 w-20 -translate-x-1/2 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-inner" />
              <span className="absolute bottom-6 left-8 h-3 w-3 rounded-full bg-slate-300" />
              <span className="absolute bottom-6 right-8 h-3 w-3 rounded-full bg-slate-300" />
            </div>

            <div className="absolute left-2 top-32 h-24 w-8 rotate-12 rounded-full bg-white shadow-lg" />
            <div className="absolute right-2 top-32 h-24 w-8 -rotate-12 rounded-full bg-white shadow-lg" />

            <div className="absolute bottom-0 left-16 h-20 w-9 rounded-full bg-white shadow-lg" />
            <div className="absolute bottom-0 right-16 h-20 w-9 rounded-full bg-white shadow-lg" />

            <div className="absolute bottom-[-10px] left-12 h-8 w-14 rounded-full bg-slate-200" />
            <div className="absolute bottom-[-10px] right-12 h-8 w-14 rounded-full bg-slate-200" />
          </div>
        </div>
      </section>
    </main>
  );
}