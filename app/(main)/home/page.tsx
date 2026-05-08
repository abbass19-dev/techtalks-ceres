import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import Benefits from "../../components/Benefits";
import Testimonials from "../../components/Testimonials";

export default function Home() {
  return (
    <main className="pb-15 text-slate-900 md:pb-20 bg-white">
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
    </main>
  );
}
