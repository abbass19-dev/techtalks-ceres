import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer />
    </main>
  );
}