"use client";

/**
 * Small live demos inside the LendOCR module cards. Each plays while visible
 * and loops. Sample data only.
 */

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import FitBox from "@/components/ui/FitBox";

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

/* ------------------------------------------------- 01 Read: number checks */

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
    value: "SBIN0001234",
    groups: [
      [0, 4, "bank code"],
      [4, 5, "always 0"],
      [5, 11, "branch code"],
    ],
    result: "State Bank of India",
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

/* ------------------------------------- 02 Bank statement: rows + analysis */

const ROWS: { date: string; text: string; amount: string; balance: string; tag: string; bad?: boolean }[] = [
  { date: "01 Aug", text: "NEFT CR ACME TECHNOLOGIES SALARY", amount: "+53,000", balance: "63,000", tag: "salary" },
  { date: "03 Aug", text: "NACH DR HOME LOAN EMI", amount: "−18,500", balance: "44,500", tag: "emi" },
  { date: "05 Aug", text: "ATM WDL CHENNAI T NAGAR", amount: "−5,000", balance: "39,500", tag: "atm" },
  { date: "12 Aug", text: "CHQ RTN INSUFFICIENT FUNDS", amount: "−500", balance: "39,000", tag: "bounce", bad: true },
  { date: "20 Aug", text: "CASH DEPOSIT BRANCH", amount: "+12,000", balance: "51,000", tag: "cash" },
];

function StatementRun({ active }: { active: boolean }) {
  const n = useTick(active, ROWS.length + 4, 650);
  const shown = Math.min(n, ROWS.length);
  const summary = n > ROWS.length;

  return (
    <div className="absolute inset-0 flex flex-col justify-center px-7">
      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
        <span>statement.pdf · opening ₹10,000</span>
        <span>balance check {shown} / {ROWS.length}</span>
      </div>
      <ul className="mt-2.5 space-y-1">
        {ROWS.map((r, i) => (
          <motion.li
            key={r.date}
            animate={{ opacity: i < shown ? 1 : 0.15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-[3.4rem_1fr_4.2rem_4.2rem_3.6rem] items-center gap-2 font-mono text-[10.5px]"
          >
            <span className="text-bone/45">{r.date}</span>
            <span className="truncate text-bone/75">{r.text}</span>
            <span className={`text-right tabular-nums ${r.amount.startsWith("+") ? "text-[#9cc4a4]" : "text-bone/70"}`}>
              {r.amount}
            </span>
            <span className="text-right text-bone/55 tabular-nums">
              {r.balance} {i < shown && <span className="text-[#9cc4a4]">✓</span>}
            </span>
            <span
              className={`justify-self-end rounded-full border px-2 py-px text-[9px] ${
                r.bad ? "border-[#e08a7a]/60 text-[#e08a7a]" : "border-bone/15 text-bone/55"
              }`}
            >
              {r.tag}
            </span>
          </motion.li>
        ))}
      </ul>
      <motion.div
        animate={{ opacity: summary ? 1 : 0, y: summary ? 0 : 6 }}
        className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-bone/60"
      >
        <span>
          salary <span className="text-gold">₹53,000/mo</span>
        </span>
        <span>
          EMI <span className="text-gold">₹18,500/mo</span>
        </span>
        <span>
          bounces <span className="text-[#e08a7a]">1</span>
        </span>
        <span className="text-[#9cc4a4]">0 balance mismatches</span>
      </motion.div>
    </div>
  );
}

export function StatementDemo() {
  return <DemoFrame>{(a) => <StatementRun active={a} />}</DemoFrame>;
}

/* -------------------------------------- 03 API keys: hash + token bucket */

const BUCKET = 6;

function KeysRun({ active }: { active: boolean }) {
  // 0..BUCKET: requests drain the bucket; BUCKET+1: a 429; then it refills.
  const n = useTick(active, BUCKET + 4, 600);
  const used = Math.min(n, BUCKET);
  const limited = n === BUCKET + 1 || n === BUCKET + 2;
  const left = n > BUCKET + 2 ? BUCKET : BUCKET - used;
  const log = Array.from({ length: Math.min(n, BUCKET) }, (_, i) => i).slice(-3);

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 px-7 font-mono">
      <div className="flex items-center gap-2 text-[10.5px]">
        <span className="rounded-sm border border-bone/15 px-2 py-0.5 text-bone/80">lo_live_8f2k_••••••</span>
        <span className="text-bone/35">→ HMAC-SHA256 →</span>
        <span className="rounded-sm border border-gold/40 px-2 py-0.5 text-gold">a91f…07c2</span>
        <span className="text-[9px] tracking-[0.1em] text-muted uppercase">only the hash is stored</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-24 text-[9px] tracking-[0.14em] text-muted uppercase">rate limit</span>
        <div className="flex gap-1.5">
          {Array.from({ length: BUCKET }, (_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: i < left ? 1 : 0.15, scale: i < left ? 1 : 0.8 }}
              className="block h-3 w-3 rounded-full bg-gold"
            />
          ))}
        </div>
        <span className="text-[10px] text-bone/45">{left} tokens left</span>
      </div>

      <ul className="h-[60px] space-y-1 text-[10.5px]">
        {limited ? (
          <motion.li initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-[#e08a7a]">
            429 rate_limited · Retry-After: 1
          </motion.li>
        ) : (
          log.map((i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-bone/60">
              <span className="text-[#9cc4a4]">200</span> POST /v1/documents:extract · scope extract · req {i + 1}
            </motion.li>
          ))
        )}
      </ul>
    </div>
  );
}

export function KeysDemo() {
  return <DemoFrame>{(a) => <KeysRun active={a} />}</DemoFrame>;
}

/* ---------------------------------------- 04 Scale: queue → workers → hook */

const JOBS = 12;
const WORKERS = 3;
const startAt = (i: number) => Math.floor(i / WORKERS) + 1;

function QueueRun({ active }: { active: boolean }) {
  const last = startAt(JOBS - 1) + 1;
  const n = useTick(active, last + 3, 700);
  const state = (i: number) => (n >= startAt(i) + 1 ? "done" : n >= startAt(i) ? "busy" : "queued");
  const queued = Array.from({ length: JOBS }, (_, i) => i).filter((i) => state(i) === "queued");
  const busy = Array.from({ length: JOBS }, (_, i) => i).filter((i) => state(i) === "busy");
  const done = JOBS - queued.length - busy.length;

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 px-7 font-mono">
      <p className="text-[9px] tracking-[0.14em] text-muted uppercase">
        POST /v1/jobs → 202 · Postgres queue · FOR UPDATE SKIP LOCKED
      </p>
      <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-4">
        <div>
          <p className="mb-2 text-[9px] text-bone/40 uppercase">queued {queued.length}</p>
          <div className="flex h-9 flex-wrap content-start gap-1">
            {queued.map((i) => (
              <motion.span key={i} layout className="block h-4 w-3 rounded-[2px] border border-bone/25 bg-bone/10" />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[9px] text-bone/40 uppercase">workers</p>
          <div className="flex gap-1.5">
            {Array.from({ length: WORKERS }, (_, w) => {
              const job = busy[w];
              return (
                <span
                  key={w}
                  className={`grid h-9 w-9 place-items-center rounded-sm border text-[9px] transition-colors duration-300 ${
                    job !== undefined ? "border-gold bg-[#1d1914] text-gold" : "border-bone/15 text-bone/30"
                  }`}
                >
                  {job !== undefined ? `#${job + 1}` : "idle"}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[9px] text-bone/40 uppercase">done</p>
          <p className="text-[26px] leading-none text-gold tabular-nums">
            {done}
            <span className="text-[12px] text-bone/40"> / {JOBS}</span>
          </p>
        </div>
      </div>
      <p className="h-4 text-[10px] text-bone/55">
        {done > 0 && (
          <motion.span key={done} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            webhook job.succeeded · X-LendOCR-Signature v1=… → <span className="text-[#9cc4a4]">200</span>
          </motion.span>
        )}
      </p>
    </div>
  );
}

export function QueueDemo() {
  return <DemoFrame>{(a) => <QueueRun active={a} />}</DemoFrame>;
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
