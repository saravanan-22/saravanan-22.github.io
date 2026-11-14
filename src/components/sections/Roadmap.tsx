"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";
import { learningPlan } from "@/lib/content";
import { AnimatedHeading, SectionLabel } from "@/components/ui/SectionTitle";

const pad = (n: number) => String(n).padStart(2, "0");
const PHASES = learningPlan.length;

/* ------------------------------------------------------------------ Diagram
 * A back-end architecture that assembles itself phase by phase. Each node and
 * edge belongs to the phase in which I plan to learn that piece.
 */

type Node = { id: string; label: string; x: number; y: number; phase: number };
type Edge = { d: string; phase: number; dashed?: boolean };

const NODES: Node[] = [
  { id: "clients", label: "Clients", x: 90, y: 250, phase: 0 },
  { id: "go", label: "Go service", x: 400, y: 250, phase: 0 },
  { id: "pg", label: "PostgreSQL", x: 400, y: 420, phase: 0 },
  { id: "ledger", label: "Ledger", x: 250, y: 420, phase: 0 },
  { id: "outbox", label: "Outbox", x: 560, y: 420, phase: 1 },
  { id: "kafka", label: "Kafka", x: 560, y: 250, phase: 1 },
  { id: "workers", label: "Workers", x: 710, y: 250, phase: 1 },
  { id: "lender", label: "Lender API", x: 710, y: 420, phase: 1 },
  { id: "gateway", label: "API gateway", x: 250, y: 250, phase: 2 },
  { id: "redis", label: "Redis", x: 250, y: 80, phase: 2 },
  { id: "grpc", label: "gRPC services", x: 560, y: 80, phase: 2 },
  { id: "otel", label: "OpenTelemetry", x: 400, y: 80, phase: 3 },
  { id: "oauth", label: "OAuth / Vault", x: 90, y: 80, phase: 3 },
  { id: "grafana", label: "Grafana", x: 710, y: 80, phase: 3 },
];

const EDGES: Edge[] = [
  { d: "M90 250 L400 250", phase: 0 },
  { d: "M400 250 L400 420", phase: 0 },
  { d: "M400 420 L250 420", phase: 0 },
  { d: "M400 420 L560 420", phase: 1 },
  { d: "M560 420 L560 250", phase: 1 },
  { d: "M560 250 L710 250", phase: 1 },
  { d: "M710 250 L710 420", phase: 1 },
  { d: "M250 250 L250 80", phase: 2 },
  { d: "M400 250 Q480 250 560 80", phase: 2 },
  { d: "M400 250 L400 80", phase: 3, dashed: true },
  { d: "M560 80 L400 80", phase: 3, dashed: true },
  { d: "M250 250 Q120 250 90 80", phase: 3 },
  { d: "M560 80 L710 80", phase: 3, dashed: true },
];

/** 0 → 1 as scroll reaches phase k (phase 0 is visible from the start). */
function usePhaseIn(p: MotionValue<number>, k: number) {
  const start = k / PHASES;
  return useTransform(p, k === 0 ? [0, 0.001] : [start - 0.04, start + 0.05], [k === 0 ? 1 : 0, 1]);
}

function Layer({ k, p, active }: { k: number; p: MotionValue<number>; active: number }) {
  const t = usePhaseIn(p, k);
  const nodeScale = useTransform(t, [0, 1], [0.6, 1]);
  const current = active === k;

  return (
    <g>
      {k === 3 && (
        <motion.rect
          x={330}
          y={30}
          width={455}
          height={445}
          rx={18}
          fill="none"
          stroke="rgb(216 166 87 / 0.35)"
          strokeDasharray="6 8"
          style={{ pathLength: t, opacity: t }}
        />
      )}
      {k === 3 && (
        <motion.text x={346} y={462} className="fill-gold font-mono" style={{ fontSize: 10, letterSpacing: "0.12em", opacity: t }}>
          KUBERNETES
        </motion.text>
      )}

      {EDGES.filter((e) => e.phase === k).map((e, i) => (
        <g key={e.d}>
          <motion.path
            d={e.d}
            fill="none"
            stroke={current ? "rgb(216 166 87 / 0.7)" : "rgb(237 232 224 / 0.22)"}
            strokeWidth={1.4}
            strokeDasharray={e.dashed ? "4 6" : undefined}
            style={{ pathLength: t }}
            className="transition-[stroke] duration-500"
          />
          {/* Data packets travelling along the edge */}
          {[0, 1].map((n) => (
            <motion.circle key={n} r={3} fill="#d8a657" style={{ opacity: t }}>
              <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${n * 1.2}s`} repeatCount="indefinite" path={e.d} />
            </motion.circle>
          ))}
        </g>
      ))}

      {NODES.filter((n) => n.phase === k).map((n) => (
        <motion.g key={n.id} style={{ opacity: t, scale: nodeScale }}>
          {current && (
            <motion.rect
              x={n.x - 66}
              y={n.y - 26}
              width={132}
              height={52}
              rx={12}
              fill="none"
              stroke="rgb(216 166 87 / 0.5)"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <rect
            x={n.x - 60}
            y={n.y - 22}
            width={120}
            height={44}
            rx={10}
            fill="#121110"
            stroke={current ? "#d8a657" : "rgb(237 232 224 / 0.18)"}
            className="transition-[stroke] duration-500"
          />
          <text
            x={n.x}
            y={n.y + 4.5}
            textAnchor="middle"
            className={current ? "fill-bone" : "fill-bone/70"}
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function Diagram({ p, active }: { p: MotionValue<number>; active: number }) {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" role="img" aria-label="Back-end architecture I plan to learn, built up phase by phase">
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgb(237 232 224 / 0.08)" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#dots)" />
      {/* Render later phases first so phase 0 sits on top where edges overlap */}
      {[3, 2, 1, 0].map((k) => (
        <Layer key={k} k={k} p={p} active={active} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ Board */

/** Topic cards flip down like a split-flap departure board when the phase changes. */
function Board({ active }: { active: number }) {
  const phase = learningPlan[active];
  return (
    <div className="[perspective:1200px]">
      <AnimatePresence mode="wait">
        <motion.div key={active} initial="in" animate="show" exit="out">
          <motion.p
            className="label !text-gold"
            variants={{ in: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 }, out: { opacity: 0, y: -8 } }}
          >
            Phase {pad(active + 1)} · {phase.phase} · {phase.when}
          </motion.p>
          <motion.h3
            className="display mt-3 origin-top text-[2.1rem] md:text-[3vw]"
            variants={{
              in: { rotateX: -90, opacity: 0 },
              show: { rotateX: 0, opacity: 1, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
              out: { rotateX: 90, opacity: 0, transition: { duration: 0.25 } },
            }}
          >
            {phase.title}
          </motion.h3>

          <ul className="mt-5 space-y-2.5 md:mt-6">
            {phase.topics.map((t, i) => (
              <motion.li
                key={t.name}
                className="hairline origin-top rounded-sm border bg-[#121110]/90 p-3.5 [backface-visibility:hidden] md:p-4"
                variants={{
                  in: { rotateX: -95, opacity: 0 },
                  show: {
                    rotateX: 0,
                    opacity: 1,
                    transition: { delay: 0.12 + i * 0.1, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
                  },
                  out: { rotateX: 95, opacity: 0, transition: { delay: i * 0.04, duration: 0.22 } },
                }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-base font-medium tracking-tight md:text-xl">{t.name}</p>
                  <span className="font-mono text-[0.65rem] text-bone/35">{pad(i + 1)}</span>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-bone/60 md:mt-1.5 md:text-[15px]">{t.why}</p>
                <p className="mt-2 hidden font-mono text-[0.68rem] tracking-[0.06em] text-gold/90 uppercase md:block">
                  Practice → {t.practice}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ Section */

/**
 * Pinned roadmap: scrolling builds the architecture diagram phase by phase
 * while the board on the left flips to that phase's topics.
 */
export default function Roadmap() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(PHASES - 1, Math.max(0, Math.floor(v * PHASES)));
    setActive((a) => (a === next ? a : next));
  });

  return (
    <section id="roadmap" ref={section} className="relative" style={{ height: `${100 + PHASES * 90}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden px-5 pt-20 pb-6 md:px-10 md:pt-24 md:pb-8">
        <SectionLabel index="07" title="Learning roadmap" className="" />

        {/* Phase progress */}
        <div className="mt-4 grid grid-cols-4 gap-2 md:mt-6 md:gap-4">
          {learningPlan.map((ph, k) => (
            <PhaseTick key={ph.phase} k={k} p={scrollYProgress} label={ph.phase} when={ph.when} active={active === k} />
          ))}
        </div>

        <div className="mt-4 grid min-h-0 flex-1 grid-rows-[minmax(0,0.8fr)_auto] gap-4 md:mt-8 md:grid-cols-12 md:grid-rows-1 md:gap-10">
          <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-5">
            <AnimatedHeading
              variant="glitch"
              className="mb-5 hidden text-[3.6vw] md:block [@media(max-height:860px)]:!hidden"
              parts={[{ text: "Going deeper on the " }, { text: "back end", accent: true }, { text: "." }]}
            />
            <Board active={active} />
          </div>
          <div className="hairline relative order-1 min-h-0 overflow-hidden rounded-md border bg-[#0d0c0b]/80 md:order-2 md:col-span-7">
            <Diagram p={scrollYProgress} active={active} />
            <p className="label absolute bottom-3 left-4 hidden md:block">Architecture I’m learning to build · grows as you scroll</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseTick({
  k,
  p,
  label,
  when,
  active,
}: {
  k: number;
  p: MotionValue<number>;
  label: string;
  when: string;
  active: boolean;
}) {
  const fill = useTransform(p, [k / PHASES, (k + 1) / PHASES], [0, 1]);
  return (
    <div>
      <div className="h-px overflow-hidden bg-bone/15">
        <motion.div className="h-full origin-left bg-gold" style={{ scaleX: fill }} />
      </div>
      <p className={`mt-2 font-mono text-[0.62rem] tracking-[0.08em] uppercase transition-colors md:text-[0.7rem] ${active ? "text-bone" : "text-muted"}`}>
        {pad(k + 1)} {label}
      </p>
      <p className="hidden font-mono text-[0.62rem] tracking-[0.08em] text-muted uppercase md:block">{when}</p>
    </div>
  );
}
