"use client";

import { AnimatePresence, motion, useInView, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { achievements, lifecycle, workAreas } from "@/lib/content";
import Reveal, { MaskLine, SectionLabel } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/SectionTitle";
import AchievementVisual, { type VisualKind } from "@/components/visuals/AchievementVisuals";

const pad = (n: number) => String(n).padStart(2, "0");

/** One achievement's text; reports when it reaches the middle of the screen. */
function AchievementBlock({
  a,
  i,
  active,
  onActive,
}: {
  a: (typeof achievements)[number];
  i: number;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center py-12 md:min-h-[80vh] md:py-0">
      <MobileVisual kind={a.visual as VisualKind} />
      <div className={`transition-opacity duration-700 ${active ? "md:opacity-100" : "md:opacity-25"}`}>
        <p className="label">
          {pad(i + 1)} · {a.tag}
        </p>
        <h3 className="display mt-4 text-[2.6rem] md:text-[3.4vw]">{a.title}</h3>
        <p className="mt-5 text-lg leading-relaxed text-bone/65">{a.description}</p>
        <p className="accent mt-6 text-2xl md:text-3xl">{a.metric}</p>
      </div>
    </div>
  );
}

const frame =
  "hairline relative overflow-hidden rounded-md border bg-ink/45 backdrop-blur-md";

/** Phones/tablets: the illustration sits above its text and plays when visible. */
function MobileVisual({ kind }: { kind: VisualKind }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  return (
    <div ref={ref} className={`${frame} mb-8 aspect-[560/440] md:hidden`}>
      <AchievementVisual key={inView ? "on" : "off"} kind={kind} active={inView} />
    </div>
  );
}

/**
 * Scrollytelling: text scrolls on the left while a pinned illustration on the
 * right cross-fades (blur + scale) to match the achievement in view.
 */
function Achievements() {
  const [active, setActive] = useState(0);
  const current = achievements[active];

  return (
    <div className="mt-20 md:mt-28">
      <Reveal className="hairline mb-4 flex items-end justify-between gap-6 border-b pb-4">
        <p className="label">Key achievements</p>
        <p className="label">{pad(achievements.length)} highlights</p>
      </Reveal>

      <div className="md:grid md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          {achievements.map((a, i) => (
            <AchievementBlock key={a.title} a={a} i={i} active={i === active} onActive={setActive} />
          ))}
        </div>

        <div className="hidden md:col-span-7 md:block">
          <div className={`${frame} sticky top-[12vh] h-[76vh]`}>
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgb(237_232_224)_1px,transparent_1px),linear-gradient(90deg,rgb(237_232_224)_1px,transparent_1px)] [background-size:40px_40px]"
            />
            <AnimatePresence>
              <motion.div
                key={active}
                className="absolute inset-0 p-8"
                initial={{ opacity: 0, scale: 0.94, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <AchievementVisual kind={current.visual as VisualKind} active />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-6 bottom-5 flex items-center justify-between gap-6">
              <p className="label">
                {pad(active + 1)} / {pad(achievements.length)} · {current.title}
              </p>
              <div className="flex gap-1.5">
                {achievements.map((a, i) => (
                  <span
                    key={a.title}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === active ? "w-8 bg-gold" : "w-3 bg-bone/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The loan journey, stage by stage, with what I built at each step. */
function Lifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });

  return (
    <div className="mt-28 md:mt-40">
      <div className="grid gap-6 md:grid-cols-12">
        <h3 className="display text-[11vw] md:col-span-7 md:text-[4.6vw]">
          <MaskLine>Across the</MaskLine>
          <MaskLine delay={0.06}>
            <span className="accent">loan lifecycle</span>.
          </MaskLine>
        </h3>
        <Reveal className="flex items-end md:col-span-4 md:col-start-9">
          <p className="text-base leading-relaxed text-bone/65 md:text-lg">
            I’ve built features at every stage of a loan, from the first application screen to
            recovery, so I understand how the pieces connect.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative mt-14 md:mt-20">
        {/* Horizontal progress rail on wide screens; each stage has its own line below that */}
        <div className="absolute inset-x-0 top-[5px] hidden h-px bg-bone/12 xl:block" />
        <motion.div
          className="absolute inset-x-0 top-[5px] hidden h-px origin-left bg-gold xl:block"
          style={{ scaleX: scrollYProgress }}
        />

        <ol className="grid gap-12 md:grid-cols-2 md:gap-x-10 xl:grid-cols-6 xl:gap-5">
          {lifecycle.map((s, i) => (
            <Reveal key={s.stage} delay={i * 0.06}>
              <li className="relative border-l border-bone/12 pl-7 xl:border-l-0 xl:pt-10 xl:pl-0">
                <span className="absolute top-0 -left-[6px] h-[11px] w-[11px] rounded-full border border-gold bg-ink xl:left-0" />
                <p className="label">Stage {pad(i + 1)}</p>
                <h4 className="display mt-2 text-4xl xl:text-[2.1vw]">{s.stage}</h4>
                <ul className="mt-5 space-y-2.5 text-[15px] leading-snug text-bone/65">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-gold" aria-hidden>
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Everything I built, grouped by area. */
function WorkAreas() {
  return (
    <div className="mt-28 md:mt-40">
      <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="label mb-4">The full list</p>
          <h3 className="display text-[2.6rem] md:text-[4vw]">
            What I built, <span className="accent">area by area</span>.
          </h3>
        </Reveal>
        <Reveal delay={0.06} className="flex items-end md:col-span-4 md:col-start-9">
          <p className="text-lg leading-relaxed text-bone/65">
            Everything I’ve worked on across 20+ business areas of the lending platform, grouped
            the way the business uses it.
          </p>
        </Reveal>
      </div>

      <div className="grid overflow-hidden rounded-sm border-t border-l border-bone/15 md:grid-cols-2">
        {workAreas.map((area, i) => (
          <motion.article
            key={area.title}
            className="group relative border-r border-b border-bone/15 bg-ink/45 backdrop-blur-md p-7 transition-colors duration-500 hover:bg-ink/60 md:p-10"
            initial="off"
            whileInView="on"
            viewport={{ once: true, margin: "-12% 0px" }}
            variants={{ on: { transition: { staggerChildren: 0.09 } }, off: {} }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left bg-gold"
              variants={{ off: { scaleX: 0 }, on: { scaleX: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
            />
            <div className="flex items-baseline gap-5">
              <motion.span
                className="display text-5xl text-transparent tabular-nums [-webkit-text-stroke:1px_rgb(216_166_87/0.7)] transition-colors duration-500 group-hover:text-gold md:text-6xl"
                variants={{ off: { opacity: 0, y: 20 }, on: { opacity: 1, y: 0 } }}
              >
                {pad(i + 1)}
              </motion.span>
              <motion.h4
                className="text-2xl font-medium tracking-tight md:text-[1.7rem]"
                variants={{ off: { opacity: 0, x: -12 }, on: { opacity: 1, x: 0 } }}
              >
                {area.title}
              </motion.h4>
            </div>
            <ul className="mt-6 space-y-3">
              {area.points.map((pt) => (
                <motion.li
                  key={pt}
                  className="flex gap-3 leading-relaxed text-bone/70"
                  variants={{ off: { opacity: 0, y: 10 }, on: { opacity: 1, y: 0 } }}
                >
                  <span className="mt-[0.7em] h-px w-4 shrink-0 bg-gold" aria-hidden />
                  {pt}
                </motion.li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default function Fintech() {
  return (
    <section id="fintech" className="relative px-5 py-28 md:px-10 md:py-40">
      <SectionLabel index="04" title="FinTech work" />

      <div className="grid gap-10 md:grid-cols-12">
        <AnimatedHeading
          variant="typewriter"
          className="text-[13vw] md:col-span-8 md:text-[7vw]"
          parts={[{ text: "Built for " }, { text: "digital lending", accent: true }, { text: "." }]}
        />
        <Reveal className="flex flex-col justify-end gap-5 md:col-span-4">
          <p className="text-lg leading-relaxed text-bone/75 md:text-xl">
            Since September 2024 I’ve worked on a lending platform that banks, finance companies
            and their partner agents use to run loans end to end.
          </p>
          <p className="label">20+ business areas · Lender API integrations · Go + React</p>
        </Reveal>
      </div>

      <Achievements />
      <Lifecycle />
      <WorkAreas />
    </section>
  );
}
