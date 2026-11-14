"use client";

/**
 * Animated illustrations for the FinTech achievements. Each one is drawn on a
 * 560 × 440 canvas (scaled by FitBox) and plays while `active` is true.
 * All names, numbers and IDs are sample data.
 */

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { lenderSteps } from "@/lib/content";
import FitBox from "@/components/ui/FitBox";

const EASE = [0.16, 1, 0.3, 1] as const;
const inr = (v: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

/** Counts 0 → max, then wraps, every `ms` while active. Remount to reset. */
function useTicker(active: boolean, max: number, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setN((v) => (v >= max ? 0 : v + 1)), ms);
    return () => clearInterval(id);
  }, [active, max, ms]);
  return n;
}

function useCount(active: boolean, to: number, duration = 1.6, delay = 0) {
  const mv = useMotionValue(0);
  useEffect(() => {
    if (!active) return;
    const c = animate(mv, to, { duration, delay, ease: EASE });
    return () => c.stop();
  }, [active, to, duration, delay, mv]);
  return mv;
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

function Badge({
  show,
  x,
  y,
  label,
  value,
  delay = 0,
}: {
  show: boolean;
  x: number;
  y: number;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute rounded-lg border border-bone/12 bg-[#171512]/95 px-3.5 py-2.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)]"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay, ease: EASE }}
        >
          <p className="font-mono text-[8.5px] tracking-[0.12em] text-muted uppercase">{label}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-bone">
            <Check className="h-3 w-3 text-gold" />
            {value}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const paperShadow = "shadow-[0_30px_80px_-20px_rgb(0_0_0/0.75)]";

/* ---------------------------------------------------------------- Journey */

function Scooter({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="10" cy="24" r="5" />
      <circle cx="38" cy="24" r="5" />
      <path d="M15 24h14l5-12h-6M34 12l-2-6h-4M10 19l4-7h10" />
    </svg>
  );
}

function Journey({ active }: { active: boolean }) {
  const n = useTicker(active, lenderSteps.length + 3, 520);
  const done = Math.min(n, lenderSteps.length);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute top-[10px] left-[170px] h-[420px] w-[220px] rounded-[34px] border-[6px] border-[#24211d] bg-[#0d0c0b] p-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-bone/15" />
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[8px] tracking-[0.12em] text-gold uppercase">Two-wheeler loan</p>
            <p className="mt-1 text-[20px] font-medium tracking-tight">₹1,20,000</p>
            <p className="text-[10px] text-bone/50">36 months · lender API</p>
          </div>
          <Scooter className="h-9 w-12 text-bone/70" />
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-bone/10">
          <motion.div
            className="h-full origin-left bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: done / lenderSteps.length }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <ul className="mt-3 space-y-[7px]">
          {lenderSteps.map((s, i) => {
            const isDone = i < done;
            const isCurrent = i === done && active;
            return (
              <li key={s} className="flex items-center gap-2.5 text-[11.5px]">
                <span
                  className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                    isDone ? "border-gold bg-gold text-ink" : isCurrent ? "border-gold" : "border-bone/20"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-2.5 w-2.5" />
                  ) : isCurrent ? (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                  ) : null}
                </span>
                <span className={`transition-colors duration-300 ${isDone ? "text-bone" : "text-bone/45"}`}>{s}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <Badge show={done >= 1} x={6} y={60} label="Application" value="Created · TW-58213" />
      <Badge show={done >= 3} x={30} y={190} label="Video KYC" value="Verified" />
      <Badge show={done >= 6} x={404} y={120} label="eNACH mandate" value="Registered" />
      <Badge show={done >= 8} x={404} y={290} label="Delivery OTP" value="Confirmed" />
    </div>
  );
}

/* ------------------------------------------------------------------- Scan */

const stagger = (each: number, delay = 0) => ({
  off: {},
  on: { transition: { staggerChildren: each, delayChildren: delay } },
});

function Scan({ active }: { active: boolean }) {
  const fields = [
    ["pan", "ABCPR1234F"],
    ["name", "SARAVANAN R"],
    ["dob", "1990-04-12"],
    ["pan_format", "pass"],
    ["holder_type", "Individual"],
  ];
  const docs = ["PAN", "Aadhaar", "GST", "Cheque", "Driving licence", "Utility bill", "Voter ID", "+8 more"];
  const brackets = [
    "left-0 top-0 border-l-2 border-t-2",
    "right-0 top-0 border-r-2 border-t-2",
    "left-0 bottom-0 border-l-2 border-b-2",
    "right-0 bottom-0 border-r-2 border-b-2",
  ];

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[52px] left-[20px] h-[200px] w-[312px]">
        {brackets.map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-gold ${c}`} />
        ))}
        <div className="absolute inset-[10px] overflow-hidden rounded-xl border border-gold/25 bg-[linear-gradient(135deg,#2b251c,#15120e)] p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8px] tracking-[0.14em] text-bone/50 uppercase">Permanent account number</p>
            <p className="font-mono text-[8px] text-gold/80 uppercase">Sample</p>
          </div>
          <div className="mt-3 flex gap-4">
            <div className="h-[84px] w-[66px] overflow-hidden rounded-md bg-bone/10">
              <svg viewBox="0 0 66 84" className="h-full w-full text-bone/25" fill="currentColor" aria-hidden>
                <circle cx="33" cy="32" r="14" />
                <path d="M8 84c2-18 12-28 25-28s23 10 25 28z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              {[
                ["Name", "SARAVANAN R"],
                ["Father’s name", "•••••••• (masked)"],
                ["Date of birth", "12/04/1990"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[7px] tracking-[0.12em] text-bone/40 uppercase">{k}</p>
                  <p className="text-[11px] text-bone/85">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2.5 font-mono text-[17px] tracking-[0.2em] text-bone">ABCPR1234F</p>
          {active && (
            <motion.div
              className="absolute inset-x-0 h-14"
              initial={{ top: "-25%" }}
              animate={{ top: ["-25%", "100%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.3, ease: "easeInOut" }}
            >
              <div className="h-full w-full bg-gradient-to-b from-transparent to-gold/25" />
              <div className="h-[2px] w-full bg-gold shadow-[0_0_18px_4px_rgb(216_166_87/0.6)]" />
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="absolute top-[40px] left-[350px] w-[192px] rounded-lg border border-bone/12 bg-[#151311]/95 p-4"
        initial="off"
        animate={active ? "on" : "off"}
        variants={stagger(0.28, 0.5)}
      >
        <p className="font-mono text-[8px] tracking-[0.14em] text-muted uppercase">Extracted · JSON</p>
        <ul className="mt-3 space-y-2">
          {fields.map(([k, v]) => (
            <motion.li
              key={k}
              variants={{ off: { opacity: 0, x: -10 }, on: { opacity: 1, x: 0 } }}
              className="flex items-center justify-between gap-2 text-[11px]"
            >
              <span className="font-mono text-bone/45">{k}</span>
              <span className="flex items-center gap-1.5 text-bone">
                {v}
                <Check className="h-3 w-3 text-[#9cc4a4]" />
              </span>
            </motion.li>
          ))}
        </ul>
        <motion.div variants={{ off: { opacity: 0 }, on: { opacity: 1 } }} className="mt-4">
          <div className="flex justify-between font-mono text-[8px] tracking-[0.12em] text-muted uppercase">
            <span>Confidence</span>
            <span className="text-bone">0.94</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-bone/10">
            <motion.div
              className="h-full origin-left bg-gold"
              variants={{ off: { scaleX: 0 }, on: { scaleX: 0.94, transition: { duration: 0.9, ease: EASE } } }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.ul
        className="absolute top-[290px] left-[20px] flex w-[520px] flex-wrap gap-2"
        initial="off"
        animate={active ? "on" : "off"}
        variants={stagger(0.08, 0.3)}
      >
        {docs.map((d) => (
          <motion.li
            key={d}
            variants={{ off: { opacity: 0, y: 8 }, on: { opacity: 1, y: 0 } }}
            className="rounded-full border border-bone/12 px-3 py-1 text-[11px] text-bone/70"
          >
            {d}
          </motion.li>
        ))}
      </motion.ul>
      <p className="absolute top-[384px] left-[20px] font-mono text-[9px] tracking-[0.14em] text-gold uppercase">
        15+ document types · wrong or unclear files flagged
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------- Report */

function Report({ active }: { active: boolean }) {
  const score = useCount(active, 742, 1.8, 0.4);
  const scoreText = useTransform(score, (v) => Math.round(v));
  const bars = [38, 52, 47, 66, 78, 92];
  const arc = "M10 62 A50 50 0 0 1 110 62";

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[34px] left-[120px] h-[386px] w-[330px] -rotate-[5deg] rounded-sm bg-bone/10" />
      <motion.div
        className={`absolute top-[22px] left-[110px] h-[396px] w-[340px] rounded-sm bg-[#f1ece3] p-6 text-ink ${paperShadow}`}
        initial={{ y: 24, opacity: 0 }}
        animate={active ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[8px] tracking-[0.14em] text-ink/50 uppercase">Credit assessment memo</p>
            <p className="mt-1 text-[15px] font-medium tracking-tight">Business loan · Sample Traders</p>
          </div>
          <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[8px] text-bone">PDF</span>
        </div>
        <div className="my-4 h-px bg-ink/10" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <svg viewBox="0 0 120 70" className="w-full" aria-hidden>
              <path d={arc} fill="none" stroke="rgb(11 10 9 / 0.1)" strokeWidth={9} strokeLinecap="round" />
              <motion.path
                d={arc}
                fill="none"
                stroke="#b9853a"
                strokeWidth={9}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={active ? { pathLength: 0.78 } : { pathLength: 0 }}
                transition={{ duration: 1.8, delay: 0.4, ease: EASE }}
              />
            </svg>
            <motion.p className="-mt-7 text-center text-[22px] font-medium tabular-nums">{scoreText}</motion.p>
            <p className="text-center font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">Credit score</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">Risk rating</p>
              <span className="mt-1 inline-block rounded-full bg-[#2f6b45]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#2f6b45]">
                Low
              </span>
            </div>
            <div>
              <p className="font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">Eligible offer</p>
              <p className="text-[15px] font-medium">₹25,00,000</p>
            </div>
            <div>
              <p className="font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">Tenure</p>
              <p className="text-[12px]">48 months</p>
            </div>
          </div>
        </div>

        <p className="mt-5 font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">GST turnover by quarter (₹ lakh)</p>
        <div className="mt-2 flex h-[80px] items-end gap-3">
          {bars.map((b, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              <motion.div
                className={`origin-bottom rounded-t-sm ${i === bars.length - 1 ? "bg-[#b9853a]" : "bg-ink/80"}`}
                style={{ height: `${b}%` }}
                initial={{ scaleY: 0 }}
                animate={active ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: EASE }}
              />
              <p className="mt-1 text-center font-mono text-[7px] text-ink/50">Q{i + 1}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">Tax return &amp; banking summary</p>
        <div className="mt-2 space-y-1.5">
          {["90%", "76%", "58%"].map((w) => (
            <div key={w} className="h-1.5 rounded bg-ink/10" style={{ width: w }} />
          ))}
        </div>
      </motion.div>
      <Badge show={active} x={404} y={330} label="Report" value="Ready to print" delay={2.2} />
    </div>
  );
}

/* --------------------------------------------------------------- Requests */

function Requests({ active }: { active: boolean }) {
  const n = useTicker(active, 4, 1400);
  const stage = Math.min(n, 2);
  const cols = ["Raised", "Approved", "Completed"];
  const counts = ["03", "05", "12"];
  const ghosts = ["Change of address", "Repayment date change", "NOC request"];
  const pill = ["bg-bone/10 text-bone/70", "bg-gold/15 text-gold", "bg-[#9cc4a4]/15 text-[#9cc4a4]"];
  const log = [
    ["10:02", "Raised by customer"],
    ["11:15", "Approved · credit manager"],
    ["11:16", "Closure quote PDF sent"],
  ];

  return (
    <div className="relative h-full w-full">
      {cols.map((c, i) => (
        <div
          key={c}
          className="absolute top-[30px] h-[230px] w-[164px] rounded-lg border border-dashed border-bone/12 bg-[#121110]/70 p-3"
          style={{ left: 20 + i * 180 }}
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">{c}</p>
            <span className="font-mono text-[9px] text-bone/40">{counts[i]}</span>
          </div>
          <div className="absolute inset-x-3 bottom-3 rounded-md border border-bone/8 bg-bone/[0.03] p-2.5">
            <p className="text-[10px] text-bone/40">{ghosts[i]}</p>
            <div className="mt-2 h-1 w-2/3 rounded bg-bone/10" />
          </div>
        </div>
      ))}

      <motion.div
        className="absolute top-[68px] w-[148px] rounded-md border border-gold/40 bg-[#1a1714] p-3 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)]"
        style={{ left: 28 }}
        animate={{ left: 28 + stage * 180, rotate: [0, stage ? -3 : 0, 0] }}
        transition={{
          left: { type: "spring", stiffness: 140, damping: 20 },
          rotate: { duration: 0.6, ease: "easeInOut" },
        }}
      >
        <p className="text-[11.5px] font-medium">Foreclosure quote</p>
        <p className="mt-0.5 font-mono text-[9px] text-bone/45">LN-20481 · ₹3,42,180</p>
        <span className={`mt-2.5 inline-block rounded-full px-2 py-0.5 font-mono text-[8px] tracking-[0.1em] uppercase ${pill[stage]}`}>
          {cols[stage]}
        </span>
      </motion.div>

      <ul className="absolute top-[290px] left-[20px] w-[520px] space-y-3">
        {log.map(([t, l], i) => {
          const on = active && i <= stage;
          return (
            <motion.li
              key={l}
              className="flex items-center gap-3 text-[12px]"
              animate={{ opacity: on ? 1 : 0.25, x: on ? 0 : -6 }}
              transition={{ duration: 0.4 }}
            >
              <span className="font-mono text-[10px] text-bone/40">{t}</span>
              <span className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-gold" : "bg-bone/20"}`} />
              <span className="text-bone/80">{l}</span>
            </motion.li>
          );
        })}
      </ul>
      <p className="absolute top-[392px] left-[20px] font-mono text-[9px] tracking-[0.14em] text-gold uppercase">
        Approval rules · required documents · full history
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- Invoice */

function Invoice({ active }: { active: boolean }) {
  const total = useCount(active, 68817.6, 1.6, 1.4);
  const totalText = useTransform(total, (v) => `₹${inr(v)}`);
  const rows = [
    ["Loans disbursed", "42"],
    ["Disbursed value", "₹48,60,000.00"],
    ["Commission @ 1.2%", "₹58,320.00"],
    ["GST @ 18%", "₹10,497.60"],
  ];
  const payouts = [40, 52, 46, 61, 58, 72, 80, 92];

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[70px] left-[14px] w-[190px] -rotate-6 rounded-sm border border-bone/10 bg-[#121110] p-2.5 opacity-70">
        <p className="mb-1.5 font-mono text-[8px] text-muted">commission_oct.xlsx</p>
        <div className="grid grid-cols-4 gap-px bg-bone/10">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} className="h-3.5 bg-[#121110]" />
          ))}
        </div>
        <motion.span
          className="absolute top-1/2 left-2 h-[2px] w-[90%] origin-left bg-[#c96a5a]"
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
        />
        <p className="mt-2 text-[10px] text-bone/50">Before: manual spreadsheets</p>
      </div>

      <motion.div
        className={`absolute top-[24px] left-[214px] h-[392px] w-[320px] rounded-sm bg-[#f1ece3] p-6 text-ink ${paperShadow}`}
        initial={{ x: 30, opacity: 0 }}
        animate={active ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[8px] tracking-[0.14em] text-ink/50 uppercase">Tax invoice · Partner commission</p>
            <p className="mt-1 text-[15px] font-medium">October 2026</p>
          </div>
          <p className="text-right font-mono text-[8px] text-ink/50">INV-2026-10-0142</p>
        </div>
        <p className="mt-2 text-[10.5px] text-ink/60">Partner: Sample Motors</p>

        <motion.ul
          className="mt-4 divide-y divide-ink/10 border-y border-ink/10"
          initial="off"
          animate={active ? "on" : "off"}
          variants={stagger(0.15, 0.5)}
        >
          {rows.map(([k, v]) => (
            <motion.li
              key={k}
              variants={{ off: { opacity: 0, y: 6 }, on: { opacity: 1, y: 0 } }}
              className="flex justify-between py-2 text-[12px]"
            >
              <span className="text-ink/60">{k}</span>
              <span className="tabular-nums">{v}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-3 flex items-end justify-between">
          <p className="font-mono text-[8px] tracking-[0.14em] text-ink/50 uppercase">Total payable</p>
          <motion.p className="text-[22px] font-medium tracking-tight tabular-nums">{totalText}</motion.p>
        </div>

        <p className="mt-4 font-mono text-[7px] tracking-[0.14em] text-ink/50 uppercase">Payouts per month</p>
        <div className="mt-1.5 flex h-10 items-end gap-1.5">
          {payouts.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 origin-bottom rounded-t-sm bg-ink/70"
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0 }}
              animate={active ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 1.2 + i * 0.06, duration: 0.6, ease: EASE }}
            />
          ))}
        </div>

        <motion.div
          className="absolute right-5 bottom-16 -rotate-12 bg-[#f1ece3]/80 rounded border-2 border-[#b9853a] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-[#b9853a] uppercase"
          initial={{ scale: 1.8, opacity: 0 }}
          animate={active ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 3, type: "spring", stiffness: 260, damping: 14 }}
        >
          Auto-generated
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------- Config */

const CONFIG_STEPS = ["Basic details", "KYC documents", "Co-applicant", "Vehicle selection", "Bank details", "Loan offer"];

function Config({ active }: { active: boolean }) {
  const n = useTicker(active, 3, 1700);
  const order = n % 2 === 1 ? [0, 1, 3, 2, 4, 5] : [0, 1, 2, 3, 4, 5];
  const coApplicantOn = n < 2;
  const items = order.map((i) => CONFIG_STEPS[i]);
  const isOn = (s: string) => s !== "Co-applicant" || coApplicantOn;
  const live = items.filter(isOn);
  const spring = { type: "spring" as const, stiffness: 320, damping: 30 };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-[30px] left-[24px] w-[290px] rounded-lg border border-bone/12 bg-[#121110]/90 p-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">Loan journey · settings</p>
          <p className="font-mono text-[9px] tracking-[0.12em] text-gold uppercase">No code</p>
        </div>
        <ul className="mt-4 space-y-2">
          {items.map((s) => {
            const on = isOn(s);
            return (
              <motion.li
                layout
                key={s}
                transition={spring}
                className="flex items-center gap-3 rounded-md border border-bone/10 bg-ink px-3 py-2.5"
              >
                <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
                  {Array.from({ length: 6 }, (_, i) => (
                    <span key={i} className="h-[3px] w-[3px] rounded-full bg-bone/30" />
                  ))}
                </span>
                <span className={`flex-1 text-[12px] transition-colors ${on ? "text-bone" : "text-bone/35"}`}>{s}</span>
                <span className={`relative flex h-4 w-7 items-center rounded-full px-0.5 transition-colors ${on ? "justify-end bg-gold" : "justify-start bg-bone/15"}`}>
                  <motion.span layout transition={spring} className="h-3 w-3 rounded-full bg-ink" />
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="absolute top-[40px] left-[346px] h-[350px] w-[190px] rounded-[28px] border-[5px] border-[#24211d] bg-[#0d0c0b] p-4">
        <p className="font-mono text-[8px] tracking-[0.12em] text-gold uppercase">Live preview</p>
        <p className="mt-1 text-[13px] font-medium">Apply for a loan</p>
        <ul className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {live.map((s, i) => (
              <motion.li
                layout
                key={s}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring}
                className="flex items-center gap-2 overflow-hidden text-[11px] text-bone/80"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/50 font-mono text-[8px] text-gold">
                  {i + 1}
                </span>
                {s}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="absolute inset-x-4 bottom-4 rounded-full bg-bone py-2 text-center text-[11px] font-medium text-ink">
          Continue
        </div>
      </div>
      <p className="absolute top-[404px] left-[24px] font-mono text-[9px] tracking-[0.14em] text-gold uppercase">
        Changes go live without a release
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------- Export */

export type VisualKind = "journey" | "scan" | "report" | "requests" | "invoice" | "config";

function Canvas({ kind, active }: { kind: VisualKind; active: boolean }) {
  switch (kind) {
    case "journey":
      return <Journey active={active} />;
    case "scan":
      return <Scan active={active} />;
    case "report":
      return <Report active={active} />;
    case "requests":
      return <Requests active={active} />;
    case "invoice":
      return <Invoice active={active} />;
    case "config":
      return <Config active={active} />;
  }
}

export default function AchievementVisual({ kind, active }: { kind: VisualKind; active: boolean }) {
  return (
    <FitBox w={560} h={440}>
      <Canvas kind={kind} active={active} />
    </FitBox>
  );
}
