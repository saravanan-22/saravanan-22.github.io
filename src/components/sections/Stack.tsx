"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { skills } from "@/lib/content";
import TiltGlare from "@/components/ui/TiltGlare";
import { AnimatedHeading, SectionLabel } from "@/components/ui/SectionTitle";

/**
 * Pinned horizontal scroll: the section sticks to the viewport while vertical
 * scrolling slides the skill cards sideways.
 */
export default function Stack() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => distance.set(Math.max(el.scrollWidth - window.innerWidth, 0));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section id="stack" ref={section} className="relative" style={{ height: `${120 + skills.length * 60}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mb-10 px-5 md:mb-14 md:px-10">
          <SectionLabel index="02" title="Stack" className="" />
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 md:gap-8 md:px-10">
          {/* Intro card */}
          <div className="flex w-[78vw] shrink-0 flex-col justify-between md:w-[34vw]">
            <p className="label">Tools of the trade</p>
            <AnimatedHeading
              variant="blur"
              className="text-[15vw] md:text-[6.5vw]"
              parts={[{ text: "What I " }, { text: "build", accent: true }, { text: " with." }]}
            />
            <p className="label">Keep scrolling →</p>
          </div>

          {skills.map((g, i) => (
            <TiltGlare key={g.group} className="rounded-sm">
            <article
              data-cursor="hover"
              className="hairline group relative flex h-[max(62svh,31rem)] w-[80vw] shrink-0 flex-col justify-between overflow-hidden rounded-sm border bg-[#0f0e0c]/85 p-7 transition-colors duration-500 hover:border-gold/60 md:w-[40vw] md:p-10"
            >
              <div className="flex justify-between">
                <span className="label">
                  {String(i + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
                </span>
                <span className="label">{g.items.length} skills</span>
              </div>

              <span
                aria-hidden
                className="display pointer-events-none absolute -right-4 -bottom-8 text-[38vw] text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_rgb(237_232_224/0.14)] group-hover:[-webkit-text-stroke:1px_rgb(216_166_87/0.5)] md:text-[18vw]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                <h3 className="display text-5xl md:text-7xl">{g.group}</h3>
                <ul className={`mt-6 flex flex-col gap-1 tracking-tight text-bone/65 ${
                    g.items.length > 7
                      ? "text-lg md:text-xl"
                      : g.items.length > 5
                        ? "text-xl md:text-2xl"
                        : "text-2xl md:text-3xl"
                  }`}>
                  {g.items.map((item) => (
                    <li key={item} className="transition-colors duration-300 group-hover:text-bone">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            </TiltGlare>
          ))}
        </motion.div>

        <div className="mx-5 mt-10 h-px bg-bone/10 md:mx-10 md:mt-14">
          <motion.div
            className="h-full origin-left bg-gold"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}
