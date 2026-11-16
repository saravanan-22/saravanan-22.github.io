import Background from "@/components/three/Background";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Fintech from "@/components/sections/Fintech";
import Hero from "@/components/sections/Hero";
import Nav from "@/components/sections/Nav";
import Roadmap from "@/components/sections/Roadmap";
import Stack from "@/components/sections/Stack";
import Work from "@/components/sections/Work";
import Cursor from "@/components/ui/Cursor";
import Loader from "@/components/ui/Loader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SkillDeck from "@/components/ui/SkillDeck";

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Cursor />
      <Background />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <About />
        <SkillDeck />
        <Stack />
        <Experience />
        <Fintech />
        <Work />
        <Education />
        <Roadmap />
        <Contact />
      </main>
    </>
  );
}
