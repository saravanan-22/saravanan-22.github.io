"use client";

import { motion, useInView, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { lendOcr } from "@/lib/content";
import FitBox from "@/components/ui/FitBox";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ================================================================ Pipeline
 * A document token runs through each stage; the stage lights up and prints
 * its output. The background-job lane starts a beat after the extract lane.
 */

type Stage = { name: string; out: string };

const LANES: { label: string; stages: Stage[] }[] = [
  {
    label: "Extract",
    stages: [
      { name: "Upload", out: "pan.jpg · 84 KB" },
      { name: "API key + quota", out: "scope extract ✓" },
      { name: "Detect type", out: "pan" },
      { name: "RapidOCR (GPU)", out: "14 lines · 0.15 s" },
      { name: "Validators", out: "3 / 3 checks pass" },
      { name: "JSON", out: "needs_review: false" },
    ],
  },
  {
    label: "Jobs",
    stages: [
      { name: "Bulk upload", out: "20 statements" },
      { name: "POST /v1/jobs", out: "202 in 52 ms" },
      { name: "Postgres queue", out: "SKIP LOCKED" },
      { name: "Workers", out: "AES-256-GCM at rest" },
      { name: "Statement analysis", out: "salary · EMI · bounces" },
      { name: "Signed webhook", out: "job.succeeded → 200" },
    ],
  },
];

const LAST = LANES[0].stages.length - 1;
const LAG = 2; // Jobs lane starts 2 ticks after Extract
const HOLD = 3; // ticks to hold the finished state before looping

function useLoop(active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const max = LAST + LAG + HOLD;
    const id = setInterval(() => setN((v) => (v >= max ? 0 : v + 1)), 850);
    return () => clearInterval(id);
  }, [active]);
  return n;
}

function DocToken() {
  return (
    <span className="relative grid h-7 w-6 place-items-center rounded-[3px] bg-gold shadow-[0_0_24px_6px_rgb(216_166_87/0.45)]">
      <span className="absolute top-0 right-0 h-2 w-2 rounded-bl-[2px] bg-[#f1d9ae]" />
      <span className="mt-1 space-y-[3px]">
        <span className="block h-[2px] w-3 bg-ink/70" />
        <span className="block h-[2px] w-2.5 bg-ink/70" />
        <span className="block h-[2px] w-3 bg-ink/70" />
      </span>
    </span>
  );
}

function StageBox({ s, state }: { s: Stage; state: "done" | "current" | "todo" }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <motion.span
        animate={state === "current" ? { scale: [1, 1.07, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 rounded-sm border px-3 py-2 text-sm whitespace-nowrap transition-colors duration-500 ${
          state === "current"
            ? "border-gold bg-[#1d1914] text-gold shadow-[0_0_30px_-6px_rgb(216_166_87/0.6)]"
            : state === "done"
              ? "border-gold/35 bg-[#121110] text-bone"
              : "hairline bg-[#121110] text-bone/45"
        }`}
      >
        {s.name}
      </motion.span>
      <span
        className={`h-4 font-mono text-[0.66rem] tracking-[0.04em] transition-opacity duration-500 ${
          state === "todo" ? "opacity-0" : state === "current" ? "text-gold opacity-100" : "text-bone/40 opacity-100"
        }`}
      >
        {s.out}
      </span>
    </div>
  );
}

function Lane({ label, stages, step }: { label: string; stages: Stage[]; step: number }) {
  const started = step >= 0;
  const at = Math.max(0, Math.min(step, LAST));
  const pct = (i: number) => ((i + 0.5) / stages.length) * 100;
  const state = (i: number) => (!started || i > at ? "todo" : i === at ? "current" : "done");

  return (
    <div className="grid gap-4 md:grid-cols-12 md:items-start">
      <p className="label md:col-span-1 md:pt-2.5">{label}</p>

      {/* Desktop: horizontal track */}
      <div className="relative hidden md:col-span-11 md:block">
        <div className="absolute top-[19px] h-px bg-bone/12" style={{ left: `${pct(0)}%`, right: `${100 - pct(LAST)}%` }} />
        <motion.div
          className="absolute top-[19px] h-px origin-left bg-gold"
          style={{ left: `${pct(0)}%`, width: `${pct(LAST) - pct(0)}%` }}
          animate={{ scaleX: started ? at / LAST : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        <motion.div
          className="absolute top-[5px] z-20 -translate-x-1/2"
          animate={{ left: `${pct(at)}%`, opacity: started ? 1 : 0, y: started ? -28 : -20 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <DocToken />
        </motion.div>
        <div className="grid grid-cols-6">
          {stages.map((s, i) => (
            <StageBox key={s.name + i} s={s} state={state(i)} />
          ))}
        </div>
      </div>

      {/* Mobile: vertical track */}
      <ol className="relative space-y-3 pl-6 md:hidden">
        <span className="absolute top-2 bottom-2 left-[5px] w-px bg-bone/12" />
        <motion.span
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-gold"
          animate={{ scaleY: started ? at / LAST : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        {stages.map((s, i) => {
          const st = state(i);
          return (
            <li key={s.name + i} className="relative flex items-center justify-between gap-3">
              <span
                className={`absolute -left-[23px] h-[11px] w-[11px] rounded-full border transition-colors duration-500 ${
                  st === "current" ? "border-gold bg-gold" : st === "done" ? "border-gold bg-ink" : "border-bone/25 bg-ink"
                }`}
              />
              <span className={`text-sm transition-colors ${st === "todo" ? "text-bone/45" : st === "current" ? "text-gold" : "text-bone"}`}>
                {s.name}
              </span>
              <span className={`font-mono text-[0.62rem] transition-opacity ${st === "todo" ? "opacity-0" : "text-bone/50"}`}>{s.out}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  return (
    <div ref={ref}>
      <PipelineRun key={inView ? "on" : "off"} active={inView} />
    </div>
  );
}

function PipelineRun({ active }: { active: boolean }) {
  const n = useLoop(active);
  return (
    <div className="flex flex-col gap-10 md:gap-8">
      <Lane label={LANES[0].label} stages={LANES[0].stages} step={active ? n : -1} />
      <Lane label={LANES[1].label} stages={LANES[1].stages} step={active ? n - LAG : -1} />
    </div>
  );
}

/* ================================================================== Orbit
 * The tech stack circles a pulsing core: back-end tools on the inner ring,
 * everything else on the outer ring, rotating in opposite directions.
 * Hover pauses the rotation.
 */

const INNER = lendOcr.core;

function Ring({
  items,
  radius,
  duration,
  reverse = false,
  gold = false,
}: {
  items: string[];
  radius: number;
  duration: number;
  reverse?: boolean;
  gold?: boolean;
}) {
  const spin = reverse ? "orbit-ccw" : "orbit-cw";
  const counter = reverse ? "orbit-cw" : "orbit-ccw";
  return (
    <div
      className={`orbit-spin ${spin} absolute top-1/2 left-1/2 rounded-full border border-dashed border-bone/12`}
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius, animationDuration: `${duration}s` }}
    >
      {items.map((t, i) => {
        const a = (360 / items.length) * i - 90;
        return (
          <div
            key={t}
            className="absolute top-1/2 left-1/2"
            style={{ transform: `rotate(${a}deg) translateX(${radius}px) rotate(${-a}deg)` }}
          >
            <span
              className={`orbit-spin ${counter} block -translate-x-1/2 -translate-y-1/2`}
              style={{ animationDuration: `${duration}s` }}
            >
              <span
                className={`block rounded-full border px-3.5 py-1.5 text-[13px] whitespace-nowrap backdrop-blur-sm transition-colors hover:border-gold hover:text-gold ${
                  gold ? "border-gold/50 bg-[#1a1712] text-bone" : "border-bone/15 bg-ink/80 text-bone/80"
                }`}
              >
                {t}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function StackOrbit() {
  const outer = lendOcr.stack.filter((t) => !INNER.includes(t));
  return (
    <div className="orbit aspect-square w-full" data-cursor="hover">
      <FitBox w={520} h={520} max={1.1}>
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {/* Core */}
          <div className="absolute top-1/2 left-1/2 h-[128px] w-[128px] -translate-x-1/2 -translate-y-1/2">
            {[0, 1].map((k) => (
              <motion.span
                key={k}
                className="absolute inset-0 rounded-full border border-gold/50"
                animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: k * 1.4, ease: "easeOut" }}
              />
            ))}
            <div className="absolute inset-0 grid place-items-center rounded-full border border-gold/60 bg-[radial-gradient(circle,#2a231a,#0f0e0c)] text-center">
              <div>
                <p className="text-[19px] font-medium tracking-tight">
                  Lend<span className="accent">OCR</span>
                </p>
                <p className="mt-1 font-mono text-[8px] tracking-[0.1em] text-gold uppercase">docker compose up</p>
              </div>
            </div>
          </div>
          <Ring items={INNER} radius={128} duration={38} gold />
          <Ring items={outer} radius={218} duration={64} reverse />
        </motion.div>
      </FitBox>
    </div>
  );
}

/* ============================================================== Git graph
 * Real milestones from the repo as a commit history: the branch line draws with
 * scroll and each milestone lands as a commit, ending on the test badge.
 */

const STEPS = lendOcr.history;

function useCommitIn(p: MotionValue<number>, i: number) {
  const at = (i + 0.5) / STEPS.length;
  return useTransform(p, [at - 0.06, at], [0, 1]);
}

function Commit({ i, p }: { i: number; p: MotionValue<number> }) {
  const w = STEPS[i];
  const t = useCommitIn(p, i);
  const scale = useTransform(t, [0, 1], [0, 1]);
  const up = i % 2 === 0;
  const y = useTransform(t, [0, 1], [up ? 14 : -14, 0]);
  const last = i === STEPS.length - 1;

  return (
    <div className="absolute top-1/2 -translate-x-1/2" style={{ left: `${((i + 0.5) / STEPS.length) * 100}%` }}>
      <motion.span
        style={{ scale }}
        className={`absolute top-0 left-0 block -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold ${
          last ? "h-5 w-5 bg-gold" : "h-3.5 w-3.5 bg-ink"
        }`}
      />
      <motion.div
        style={{ opacity: t, y }}
        className={`absolute left-0 w-[min(15vw,220px)] -translate-x-1/2 ${up ? "bottom-5" : "top-5"}`}
      >
        <div className={`flex flex-col items-center text-center ${up ? "" : "flex-col-reverse"}`}>
          <div className={`flex flex-col gap-1 ${up ? "" : "flex-col-reverse"}`}>
            <p className="font-mono text-[0.64rem] tracking-[0.06em] text-gold">
              {w.hash}
            </p>
            <p className="text-[13px] leading-snug text-bone/75">
              <span className="font-mono text-[0.68rem] text-bone/45">{w.scope}: </span>
              {w.build}
            </p>
            {last && (
              <span className="mx-auto mt-1 rounded-full bg-gold px-2.5 py-0.5 font-mono text-[0.66rem] font-medium text-ink">
                {lendOcr.historyEnd}
              </span>
            )}
          </div>
          <span className={`block h-5 w-px bg-gold/30 ${up ? "mt-2" : "mb-2"}`} />
        </div>
      </motion.div>
    </div>
  );
}

function MobileCommit({ i, p }: { i: number; p: MotionValue<number> }) {
  const w = STEPS[i];
  const t = useCommitIn(p, i);
  const x = useTransform(t, [0, 1], [-12, 0]);
  const last = i === STEPS.length - 1;
  return (
    <motion.li style={{ opacity: t, x }} className="relative pl-7">
      <span
        className={`absolute top-1 -left-[1px] -translate-x-1/2 rounded-full border-2 border-gold ${last ? "h-4 w-4 bg-gold" : "h-3 w-3 bg-ink"}`}
      />
      <p className="font-mono text-[0.64rem] text-gold">
        {w.hash}
      </p>
      <p className="mt-0.5 text-sm leading-snug text-bone/75">
        <span className="font-mono text-[0.68rem] text-bone/45">{w.scope}: </span>
        {w.build}
      </p>
      {last && (
        <span className="mt-2 inline-block rounded-full bg-gold px-2.5 py-0.5 font-mono text-[0.66rem] font-medium text-ink">
          {lendOcr.historyEnd}
        </span>
      )}
    </motion.li>
  );
}

export function BuildGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });

  return (
    <div ref={ref}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <p className="label">Build history · real commits</p>
        <p className="font-mono text-[0.7rem] text-bone/40">
          <span className="text-gold">$</span> git log --graph main
        </p>
      </div>

      {/* Desktop: horizontal history */}
      <div className="relative hidden h-[300px] md:block">
        <div className="absolute inset-x-0 top-1/2 h-px bg-bone/10" />
        <motion.div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 origin-left bg-gold" style={{ scaleX: p }} />
        <span className="absolute top-1/2 left-0 -translate-y-[calc(100%+8px)] font-mono text-[0.62rem] text-bone/35">main</span>
        {STEPS.map((w, i) => (
          <Commit key={w.hash} i={i} p={p} />
        ))}
      </div>

      {/* Mobile: vertical log */}
      <ol className="relative ml-2 space-y-6 md:hidden">
        <span className="absolute top-1 bottom-1 left-0 w-px bg-bone/10" />
        <motion.span className="absolute top-1 bottom-1 left-0 w-[2px] -translate-x-1/2 origin-top bg-gold" style={{ scaleY: p }} />
        {STEPS.map((w, i) => (
          <MobileCommit key={w.hash} i={i} p={p} />
        ))}
      </ol>
    </div>
  );
}

