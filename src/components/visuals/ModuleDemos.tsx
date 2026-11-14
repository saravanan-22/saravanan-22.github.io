"use client";

/**
 * Small live demos inside the LoanDocs module cards. Each plays while visible
 * and loops. Sample data only.
 */

import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import FitBox from "@/components/ui/FitBox";

const EASE = [0.16, 1, 0.3, 1] as const;

function useTick(active: boolean, max: number, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setN((v) => (v >= max ? 0 : v + 1)), ms);
    return () => clearInterval(id);
  }, [active, max, ms]);
  return n;
}

/** Frame that only runs its demo while on screen (remounts to restart). */
function DemoFrame({ children }: { children: (active: boolean) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  return (
    <div ref={ref} className="hairline mt-8 h-[170px] overflow-hidden rounded-sm border bg-[#0d0c0b]/80 md:h-[190px]">
      <FitBox w={560} h={190} max={1.15}>
        <div key={inView ? "on" : "off"} className="relative h-full w-full">
          {children(inView)}
        </div>
      </FitBox>
    </div>
  );
}

/* ------------------------------------------------- 01 Read: format checks */

const IDS: { doc: string; value: string; groups: [number, number, string][]; result: string }[] = [
  {
    doc: "PAN",
    value: "ABCPR1234F",
    groups: [
      [0, 3, "series"],
      [3, 4, "P = individual"],
      [4, 5, "R = surname initial"],
      [5, 9, "4 digits"],
      [9, 10, "check letter"],
    ],
    result: "format valid",
  },
  {
    doc: "GSTIN",
    value: "33ABCPR1234F1Z5",
    groups: [
      [0, 2, "state 33"],
      [2, 12, "PAN inside"],
      [12, 13, "entity"],
      [13, 14, "Z"],
      [14, 15, "checksum"],
    ],
    result: "checksum valid",
  },
  {
    doc: "Aadhaar",
    value: "XXXX XXXX 4821",
    groups: [
      [0, 9, "masked by default"],
      [10, 14, "last 4 kept"],
    ],
    result: "Verhoeff valid",
  },
  {
    doc: "IFSC",
    value: "ABCD0123456",
    groups: [
      [0, 4, "bank code"],
      [4, 5, "always 0"],
      [5, 11, "branch code"],
    ],
    result: "found in RBI list",
  },
];

function ValidatorRun({ active }: { active: boolean }) {
  const STEP_MAX = 8; // groups + pause, per document
  const n = useTick(active, IDS.length * STEP_MAX - 1, 420);
  const doc = IDS[Math.floor(n / STEP_MAX)];
  const g = n % STEP_MAX; // how many groups revealed
  const groupOf = (i: number) => doc.groups.findIndex(([a, b]) => i >= a && i < b);
  const done = g > doc.groups.length;

  return (
    <div className="absolute inset-0 flex flex-col justify-center px-8">
      <div className="flex items-center justify-between">
        <motion.p
          key={doc.doc}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase"
        >
          Validating · {doc.doc}
        </motion.p>
        <motion.span
          animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.8 }}
          className="rounded-full bg-[#9cc4a4]/15 px-2.5 py-1 font-mono text-[10px] text-[#9cc4a4]"
        >
          ✓ {doc.result}
        </motion.span>
      </div>

      <p className="mt-4 font-mono text-[34px] tracking-[0.12em]">
        {doc.value.split("").map((ch, i) => {
          const gi = groupOf(i);
          const state = gi === -1 ? "space" : gi < g - 1 ? "done" : gi === g - 1 ? "current" : "todo";
          return (
            <span
              key={doc.doc + i}
              className={`inline-block transition-colors duration-300 ${
                state === "current" ? "text-gold" : state === "done" ? "text-bone" : "text-bone/25"
              }`}
            >
              {ch === " " ? " " : ch}
            </span>
          );
        })}
      </p>

      <div className="mt-4 flex h-6 flex-wrap gap-2">
        {doc.groups.slice(0, Math.min(g, doc.groups.length)).map(([, , label], i) => (
          <motion.span
            key={doc.doc + label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
              i === g - 1 ? "border-gold/60 text-gold" : "border-bone/15 text-bone/55"
            }`}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function ValidatorDemo() {
  return <DemoFrame>{(a) => <ValidatorRun active={a} />}</DemoFrame>;
}

/* ------------------------------------------ 02 Cross-document match score */

function MatchRun({ active }: { active: boolean }) {
  const cycle = useTick(active, 1, 5200);
  return <MatchScene key={cycle} active={active} />;
}

function MatchScene({ active }: { active: boolean }) {
  const score = useMotionValue(0);
  const text = useTransform(score, (v) => `${Math.round(v)}%`);
  useEffect(() => {
    if (!active) return;
    const c = animate(score, 96, { duration: 1.6, delay: 1.4, ease: EASE });
    return () => c.stop();
  }, [active, score]);

  const docs = [
    { y: 40, label: "PAN", value: "SARAVANAN R", ok: true },
    { y: 95, label: "Aadhaar", value: "SARAVANAN R", ok: true },
    { y: 150, label: "Utility bill", value: "address ≠", ok: false },
  ];
  const ring = 2 * Math.PI * 34;

  return (
    <svg viewBox="0 0 560 190" className="absolute inset-0 h-full w-full" aria-hidden>
      {docs.map((d, i) => (
        <g key={d.label}>
          <motion.g
            initial={{ opacity: 0, x: -14 }}
            animate={active ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.5, ease: EASE }}
          >
            <rect x={24} y={d.y - 18} width={170} height={36} rx={8} fill="#121110" stroke="rgb(237 232 224 / 0.15)" />
            <text x={38} y={d.y - 2} className="fill-muted font-mono" style={{ fontSize: 8.5, letterSpacing: "0.12em" }}>
              {d.label.toUpperCase()}
            </text>
            <text x={38} y={d.y + 11} className={d.ok ? "fill-bone" : "fill-[#d88a7a]"} style={{ fontSize: 11.5 }}>
              {d.value}
            </text>
          </motion.g>
          <motion.path
            d={`M194 ${d.y} C 280 ${d.y}, 300 95, 366 95`}
            fill="none"
            stroke={d.ok ? "#d8a657" : "#d88a7a"}
            strokeWidth={1.4}
            strokeDasharray={d.ok ? undefined : "4 5"}
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.25, duration: 0.8, ease: EASE }}
          />
        </g>
      ))}
      <circle cx={406} cy={95} r={34} fill="#121110" stroke="rgb(237 232 224 / 0.1)" strokeWidth={6} />
      <motion.circle
        cx={406}
        cy={95}
        r={34}
        fill="none"
        stroke="#d8a657"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={ring}
        transform="rotate(-90 406 95)"
        initial={{ strokeDashoffset: ring }}
        animate={active ? { strokeDashoffset: ring * 0.04 } : {}}
        transition={{ delay: 1.4, duration: 1.6, ease: EASE }}
      />
      <motion.text x={406} y={100} textAnchor="middle" className="fill-bone" style={{ fontSize: 15, fontWeight: 500 }}>
        {text}
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 2.8 }}>
        <text x={458} y={78} className="fill-[#9cc4a4]" style={{ fontSize: 10.5 }}>✓ name</text>
        <text x={458} y={98} className="fill-[#9cc4a4]" style={{ fontSize: 10.5 }}>✓ DOB</text>
        <text x={458} y={118} className="fill-[#d88a7a]" style={{ fontSize: 10.5 }}>⚠ address</text>
      </motion.g>
    </svg>
  );
}

export function MatchDemo() {
  return <DemoFrame>{(a) => <MatchRun active={a} />}</DemoFrame>;
}

/* ------------------------------------------- 03 Generate: placeholders fill */

const TOKENS = [
  { key: "borrower", value: "Saravanan R" },
  { key: "amount", value: "₹5,00,000" },
  { key: "rate", value: "10.5% p.a." },
  { key: "tenure", value: "36 months" },
  { key: "emi", value: "₹16,251.22" },
];

function Token({ i, filled }: { i: number; filled: boolean }) {
  const t = TOKENS[i];
  return (
    <span className="relative inline-grid align-baseline [perspective:400px]">
      <AnimatePresence mode="wait" initial={false}>
        {filled ? (
          <motion.span
            key="v"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-medium text-ink"
          >
            {t.value}
          </motion.span>
        ) : (
          <motion.span
            key="k"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded border border-dashed border-[#b9853a]/70 bg-[#b9853a]/10 px-1 font-mono text-[10.5px] text-[#9a6b26]"
          >
            {`{{${t.key}}}`}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function MergeRun({ active }: { active: boolean }) {
  const n = useTick(active, TOKENS.length + 5, 520);
  const filled = (i: number) => i < n;
  const done = n > TOKENS.length;

  return (
    <div className="absolute inset-0 flex items-center gap-6 px-8">
      <div className="relative h-[156px] w-[330px] rounded-sm bg-[#f1ece3] p-4 text-[12px] leading-[1.9] text-ink/80 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)]">
        <p className="font-mono text-[8px] tracking-[0.14em] text-ink/45 uppercase">sanction-letter.html</p>
        <p className="mt-1">
          Dear <Token i={0} filled={filled(0)} />,
        </p>
        <p>
          Your loan of <Token i={1} filled={filled(1)} /> is sanctioned at <Token i={2} filled={filled(2)} /> for{" "}
          <Token i={3} filled={filled(3)} />.
        </p>
        <p>
          Monthly EMI: <Token i={4} filled={filled(4)} />
        </p>
        <motion.span
          className="absolute right-4 bottom-3 -rotate-12 rounded border-2 border-[#b9853a] px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-[#b9853a] uppercase"
          animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 1.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
        >
          PDF ready
        </motion.span>
      </div>
      <div className="flex-1 font-mono text-[10.5px] leading-[1.8] text-bone/45">
        {TOKENS.map((t, i) => (
          <p key={t.key} className={`transition-colors duration-300 ${filled(i) ? "text-bone/80" : ""}`}>
            <span className="text-bone/35">&quot;{t.key}&quot;:</span>{" "}
            <span className={filled(i) ? "text-gold" : ""}>&quot;{t.value}&quot;</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function MergeDemo() {
  return <DemoFrame>{(a) => <MergeRun active={a} />}</DemoFrame>;
}

/* ------------------------------------------------ 04 Calculators: live EMI */

const P = 500000;
const R = 10.5 / 1200;
const emiFor = (n: number) => (P * R * (1 + R) ** n) / ((1 + R) ** n - 1);
const inr = (v: number, d = 0) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

function CalcRun({ active }: { active: boolean }) {
  const tenure = useMotionValue(12);
  useEffect(() => {
    if (!active) return;
    const c = animate(tenure, 60, { duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", repeatDelay: 0.6 });
    return () => c.stop();
  }, [active, tenure]);

  const months = useTransform(tenure, (n) => `${Math.round(n)} months`);
  const emi = useTransform(tenure, (n) => `₹${inr(emiFor(Math.round(n)), 2)}`);
  const interest = useTransform(tenure, (n) => {
    const m = Math.round(n);
    return `₹${inr(emiFor(m) * m - P)}`;
  });
  const interestShare = useTransform(tenure, (n) => {
    const m = Math.round(n);
    const total = emiFor(m) * m;
    return `${((total - P) / total) * 100}%`;
  });
  const thumb = useTransform(tenure, [12, 60], ["0%", "100%"]);

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-5 px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">₹5,00,000 at 10.5% · tenure</p>
          <motion.p className="mt-1 text-[15px] text-bone">{months}</motion.p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">Monthly EMI</p>
          <motion.p className="mt-1 text-[26px] font-medium tracking-tight text-gold tabular-nums">{emi}</motion.p>
        </div>
      </div>

      <div className="relative h-1 rounded-full bg-bone/12">
        <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gold/60" style={{ width: thumb }} />
        <motion.span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-ink"
          style={{ left: thumb }}
        />
        <span className="absolute top-3 left-0 font-mono text-[8px] text-bone/35">12</span>
        <span className="absolute top-3 right-0 font-mono text-[8px] text-bone/35">60</span>
      </div>

      <div>
        <div className="flex justify-between font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
          <span>Principal ₹5,00,000</span>
          <span>
            Interest <motion.span className="text-bone/80">{interest}</motion.span>
          </span>
        </div>
        <div className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-bone/80">
          <span className="flex-1" />
          <motion.span className="bg-gold" style={{ width: interestShare }} />
        </div>
      </div>
    </div>
  );
}

export function CalcDemo() {
  return <DemoFrame>{(a) => <CalcRun active={a} />}</DemoFrame>;
}

/* ----------------------------------------------------------- Blinds reveal */

/** Horizontal shutters that open to reveal a card when it scrolls into view. */
export function Blinds({ strips = 6 }: { strips?: number }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 flex flex-col"
      initial="closed"
      whileInView="open"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={{ open: { transition: { staggerChildren: 0.07 } }, closed: {} }}
    >
      {Array.from({ length: strips }, (_, i) => (
        <motion.span
          key={i}
          className="block flex-1 origin-top bg-[#14120f]"
          variants={{
            closed: { scaleY: 1.02 },
            open: { scaleY: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
          }}
        />
      ))}
    </motion.div>
  );
}
