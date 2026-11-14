"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { navLinks, profile } from "@/lib/content";
import LocalTime from "@/components/ui/LocalTime";
import ScrambleText from "@/components/ui/ScrambleText";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <nav className="grid grid-cols-2 items-start gap-6 px-5 py-5 text-sm md:grid-cols-12 md:px-10 md:py-7">
          <a href="#top" className="font-medium tracking-tight md:col-span-3">
            {profile.name}
            <span className="align-super text-[0.6em]">©</span>
          </a>

          <p className="hidden leading-snug text-white/60 md:col-span-3 md:block">
            Full-Stack Developer · FinTech
            <br />
            Tiruppur, India — <LocalTime />
          </p>

          <ul className="hidden gap-x-6 md:col-span-4 md:flex md:flex-wrap">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-draw">
                  <ScrambleText text={l.label} />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center justify-end gap-2 md:col-span-2 md:flex">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
            <span className="text-white/80">Available</span>
          </div>

          <button
            className="justify-self-end md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-5 py-5 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium">{profile.name}</span>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
            <ul className="mt-auto flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline gap-3 text-6xl"
                  >
                    <span className="label">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="label mt-10">{profile.availability}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
