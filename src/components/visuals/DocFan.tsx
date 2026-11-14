"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

/* Sample documents only — every number below is fake. */

function Label({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-[7px] tracking-[0.14em] uppercase md:text-[8px] ${dark ? "text-ink/50" : "text-bone/50"}`}>
      {children}
    </p>
  );
}

function Lines({ dark = false, widths = ["80%", "62%", "70%"] }: { dark?: boolean; widths?: string[] }) {
  return (
    <div className="mt-2 space-y-1.5">
      {widths.map((w, i) => (
        <div key={i} className={`h-1 rounded ${dark ? "bg-ink/12" : "bg-bone/15"}`} style={{ width: w }} />
      ))}
    </div>
  );
}

const card =
  "absolute h-[128px] w-[200px] rounded-xl p-3.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] md:h-[164px] md:w-[260px] md:p-4";

const DOCS: { title: string; body: ReactNode; className: string }[] = [
  {
    title: "PAN",
    className: "border border-gold/25 bg-[linear-gradient(135deg,#2b251c,#15120e)] text-bone",
    body: (
      <>
        <Label>Permanent account number · sample</Label>
        <div className="mt-3 flex gap-3">
          <div className="h-12 w-10 rounded bg-bone/10 md:h-16 md:w-12" />
          <div className="flex-1">
            <Lines widths={["70%", "55%"]} />
            <p className="mt-3 font-mono text-[12px] tracking-[0.18em] md:text-[14px]">ABCPR1234F</p>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Aadhaar",
    className: "border border-bone/15 bg-[linear-gradient(135deg,#22262a,#121416)] text-bone",
    body: (
      <>
        <Label>Aadhaar · masked by default</Label>
        <div className="mt-3 flex gap-3">
          <div className="h-12 w-10 rounded bg-bone/10 md:h-16 md:w-12" />
          <div className="flex-1">
            <Lines widths={["65%", "50%", "58%"]} />
          </div>
        </div>
        <p className="mt-3 font-mono text-[12px] tracking-[0.16em] md:text-[14px]">XXXX XXXX 4821</p>
      </>
    ),
  },
  {
    title: "Cheque",
    className: "border border-[#3b4a3f] bg-[linear-gradient(135deg,#1d2620,#101512)] text-bone",
    body: (
      <>
        <div className="flex justify-between">
          <Label>Sample bank · cheque</Label>
          <Label>IFSC ABCD0123456</Label>
        </div>
        <Lines widths={["90%", "75%"]} />
        <p className="mt-2 text-right font-mono text-[11px] md:text-[13px]">₹ 1,25,000.00</p>
        <p className="mt-3 font-mono text-[9px] tracking-[0.2em] text-bone/60 md:mt-5 md:text-[10px]">⑈004512⑈ 600002000⑆ 11</p>
      </>
    ),
  },
  {
    title: "GST certificate",
    className: "bg-[#ece6dc] text-ink",
    body: (
      <>
        <Label dark>GST registration · sample</Label>
        <p className="mt-2 font-mono text-[11px] tracking-[0.08em] md:text-[13px]">GSTIN 33ABCPR1234F1Z5</p>
        <Lines dark widths={["85%", "70%", "78%", "50%"]} />
      </>
    ),
  },
  {
    title: "Bank statement",
    className: "bg-[#f1ece3] text-ink",
    body: (
      <>
        <Label dark>Bank statement · Apr–Sep</Label>
        <div className="mt-2 space-y-1 font-mono text-[8px] md:text-[9px]">
          {[
            ["01 Apr", "SALARY", "+52,000"],
            ["05 Apr", "EMI", "−8,450"],
            ["12 Apr", "UPI", "−1,200"],
            ["01 May", "SALARY", "+52,000"],
          ].map(([d, n, a]) => (
            <div key={d} className="flex justify-between border-b border-ink/10 pb-0.5">
              <span className="text-ink/50">{d}</span>
              <span>{n}</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

function FanCard({ i, p }: { i: number; p: MotionValue<number> }) {
  const k = i - (DOCS.length - 1) / 2; // -2 … 2
  const x = useTransform(p, [0.1, 0.45], [`${k * 1.2}vw`, `${k * 14}vw`]);
  const y = useTransform(p, [0.1, 0.45], [k * -6, Math.abs(k) * 34 - 30]);
  const rotate = useTransform(p, [0.1, 0.45], [k * 2, k * 13]);
  const rotateX = useTransform(p, [0.05, 0.45], [55, 0]);
  const doc = DOCS[i];

  return (
    <motion.div
      className={`${card} ${doc.className}`}
      style={{ x, y, rotate, rotateX, zIndex: 10 - Math.abs(Math.round(k)) }}
    >
      {doc.body}
    </motion.div>
  );
}

/**
 * Scroll-driven 3D: a pile of input documents fans out in perspective, then a
 * generated loan PDF rises in front of them.
 */
export default function DocFan() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });

  const pdfY = useTransform(p, [0.38, 0.62], ["40%", "-4%"]);
  const pdfScale = useTransform(p, [0.38, 0.62], [0.8, 1]);
  const pdfOpacity = useTransform(p, [0.38, 0.55], [0, 1]);
  const captionOpacity = useTransform(p, [0.45, 0.6], [0, 1]);

  return (
    <div ref={ref} className="relative mt-16 h-[62svh] min-h-[420px] md:mt-24 md:h-[80svh]">
      <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
        {DOCS.map((d, i) => (
          <FanCard key={d.title} i={i} p={p} />
        ))}

        <motion.div
          className="absolute z-20 h-[230px] w-[176px] rounded-sm bg-[#f7f3ec] p-4 text-ink shadow-[0_40px_90px_-20px_rgb(0_0_0/0.9)] md:h-[300px] md:w-[230px] md:p-5"
          style={{ y: pdfY, scale: pdfScale, opacity: pdfOpacity }}
        >
          <div className="flex items-start justify-between">
            <Label dark>Sanction letter</Label>
            <span className="rounded bg-[#b9853a] px-1.5 py-0.5 font-mono text-[8px] text-white">PDF</span>
          </div>
          <p className="mt-3 text-[13px] font-medium md:text-[15px]">Loan sanctioned</p>
          <Lines dark widths={["90%", "80%", "86%"]} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] md:text-[11px]">
            <div>
              <Label dark>Amount</Label>
              <p className="font-medium">₹5,00,000</p>
            </div>
            <div>
              <Label dark>EMI</Label>
              <p className="font-medium">₹16,251.22</p>
            </div>
            <div>
              <Label dark>Rate</Label>
              <p>10.5% p.a.</p>
            </div>
            <div>
              <Label dark>Tenure</Label>
              <p>36 months</p>
            </div>
          </div>
          <Lines dark widths={["85%", "60%"]} />
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between md:inset-x-5">
            <div className="h-px w-16 bg-ink/40" />
            <div className="grid h-8 w-8 grid-cols-4 gap-px md:h-10 md:w-10" aria-hidden>
              {Array.from({ length: 16 }, (_, i) => (
                <span key={i} className={(i * 7) % 3 ? "bg-ink" : "bg-transparent"} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: captionOpacity }}
        className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        <span className="label">Documents in</span>
        <span className="text-gold">→</span>
        <span className="label !text-bone">Validated JSON + loan PDFs out</span>
      </motion.div>
    </div>
  );
}
