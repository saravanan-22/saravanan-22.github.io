import { about, stats } from "@/lib/content";
import Reveal, { ScrollText, SectionLabel, StatValue } from "@/components/ui/Reveal";
import XrayLens from "@/components/ui/XrayLens";
import { AnimatedHeading } from "@/components/ui/SectionTitle";

export default function About() {
  return (
    <section id="about" className="relative px-5 py-28 md:px-10 md:py-40">
      <SectionLabel index="01" title="About" />
      <AnimatedHeading
        variant="cascade"
        className="mb-14 text-[15vw] md:mb-20 md:text-[8vw]"
        parts={[{ text: "Who I " }, { text: "am", accent: true }, { text: "." }]}
      />

      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="label">Who I am</p>
        </Reveal>
        <ScrollText
          text={about}
          className="text-[clamp(1.55rem,3.1vw,3rem)] leading-[1.12] font-medium tracking-[-0.025em] md:col-span-9"
        />
      </div>

      <div className="mt-20 grid gap-px md:mt-32 md:grid-cols-12">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="hairline border-t pt-5 md:col-span-3"
          >
            <StatValue value={s.value} className="display block text-6xl tabular-nums md:text-7xl" />
            <p className="label mt-3">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <XrayLens />
    </section>
  );
}
