import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="bg-[#f8fafc] text-slate-900 pb-15 md:pb-0">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer />
    </main>
  );
}
