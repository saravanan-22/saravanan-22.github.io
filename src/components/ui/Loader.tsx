"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { store } from "@/lib/store";

const EASE = [0.16, 1, 0.3, 1] as const;
const WIPE = [0.76, 0, 0.24, 1] as const;
const COLUMNS = 5;
const WORDS = ["Design", "Develop", "Deploy"];

type Phase = "load" | "out" | "wipe" | "done";

/**
 * Intro: words roll through the centre (Design → Develop → Deploy → name)
 * while a counter runs; then the screen, built from vertical columns,
 * slides away upward column by column to reveal the site.
 */
export default function Loader() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("load");

  useEffect(() => {
    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      // ~2.4s run; hold at 90 until WebGL is ready (max 5s).
      const cap = store.sceneReady || elapsed > 5000 ? 100 : 90;
      const k = Math.min(elapsed / 2400, 1);
      const value = Math.min(100 * (1 - Math.pow(1 - k, 2.2)), cap);
      setCount(value);
      if (value >= 100) {
        timers.push(setTimeout(() => setPhase("out"), 450));
        timers.push(
          setTimeout(() => {
            setPhase("wipe");
            store.introDone = true;
            store.lenis?.start();
            window.dispatchEvent(new Event("intro:done"));
          }, 850)
        );
        timers.push(setTimeout(() => setPhase("done"), 850 + 1300));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === "done") return null;

  const p = count / 100;
  const wordIndex = Math.min(WORDS.length, Math.floor(p * (WORDS.length + 1)));
  const isName = wordIndex >= WORDS.length;
  const word = isName ? profile.name : WORDS[wordIndex];
  const contentHidden = phase === "out" || phase === "wipe";

  return (
    <div className="fixed inset-0 z-[200]" aria-label="Loading" role="status">
      {/* Background built from columns that wipe away */}
      <div className="absolute inset-0 flex" aria-hidden>
        {Array.from({ length: COLUMNS }, (_, i) => (
          <motion.div
            key={i}
            className="relative h-full flex-1 bg-ink"
            style={{ marginLeft: i === 0 ? 0 : -1 }}
            initial={{ y: "0%" }}
            animate={{ y: phase === "wipe" ? "-100%" : "0%" }}
            transition={{ duration: 0.9, delay: i * 0.075, ease: WIPE }}
          >
            {/* gold leading edge that sweeps up with the column */}
            <span className="absolute inset-x-0 bottom-0 h-px bg-gold shadow-[0_0_14px_rgb(216_166_87/0.8)]" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative flex h-full flex-col justify-between p-5 md:p-10"
        animate={{ opacity: contentHidden ? 0 : 1, y: contentHidden ? -30 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <motion.div
          className="label flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span>{profile.name} — Portfolio</span>
          <span>© 2026</span>
        </motion.div>

        <div className="flex flex-col items-center text-center">
          <span className="label mb-6">
            {isName ? "Full-stack developer" : `0${wordIndex + 1} / 0${WORDS.length}`}
          </span>
          <span className="relative block h-[1.15em] w-full overflow-hidden text-[15vw] leading-[1.1] md:text-[8vw]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={word}
                className={`block whitespace-nowrap ${isName ? "display" : "accent"}`}
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-105%" }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <div className="flex items-end justify-between">
          <span className="label mb-2">Loading experience</span>
          <span className="display text-[18vw] leading-[0.8] tabular-nums text-bone/90 md:text-[9vw]">
            {Math.floor(count)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
