"use client";

import gsap from "gsap";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import { store } from "@/lib/store";

/**
 * Variable-font proximity: letters of the giant name grow bolder and slightly
 * taller as the cursor approaches, easing back as it leaves (mouse only).
 */
function useNameProximity(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || store.reduced) return;
    const chars = Array.from(root.current?.querySelectorAll<HTMLElement>(".name-char") ?? []);
    if (!chars.length) return;
    const current = chars.map(() => 0);
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const loop = () => {
      const radius = Math.max(window.innerWidth * 0.16, 220);
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = (my - (r.top + r.height / 2)) * 0.6;
        const d = Math.hypot(dx, dy);
        const target = Math.pow(Math.max(0, 1 - d / radius), 1.6);
        current[i] += (target - current[i]) * 0.14;
        const k = current[i];
        el.style.fontWeight = String(560 + 340 * k);
        el.style.transform = `scaleY(${1 + 0.07 * k})`;
      });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [root]);
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useNameProximity(root);
  // Scroll-out: the statement lifts and fades while the giant name pushes forward.
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const statementY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const statementOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.from(".hero-line", { yPercent: 110, duration: 1.4, stagger: 0.09 })
        .from(".hero-char", { yPercent: 110, duration: 1.5, stagger: 0.035 }, 0.15)
        .from(".hero-fade", { opacity: 0, y: 12, duration: 1.2, stagger: 0.06 }, 0.5);
      const play = () => tl.play();
      if (store.introDone) play();
      else window.addEventListener("intro:done", play, { once: true });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-svh flex-col justify-between px-5 pt-28 pb-5 md:px-10 md:pt-40 md:pb-6"
    >
      {/* Statement */}
      <motion.div
        style={{ y: statementY, opacity: statementOpacity }}
        className="grid gap-8 md:grid-cols-12"
      >
        <h1 className="display text-[11.5vw] md:col-span-9 md:text-[6.2vw]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block">Full-stack developer</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block">
              building <span className="accent">digital lending</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block">software, end to end.</span>
          </span>
        </h1>
        <div className="flex flex-col justify-end gap-4 md:col-span-3 md:pb-3">
          <p className="hero-fade max-w-xs text-[15px] leading-relaxed text-bone/70">
            {profile.tagline}
          </p>
          <p className="hero-fade label">Go · React · TypeScript · MySQL</p>
        </div>
      </motion.div>

      {/* Meta row + giant name */}
      <div>
        <div className="hairline grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-12">
          <span className="hero-fade label md:col-span-3">Based in {profile.location}</span>
          <span className="hero-fade label hidden md:col-span-3 md:block">{profile.coords}</span>
          <span className="hero-fade label flex items-center gap-2 md:col-span-4">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
            {profile.availability}
          </span>
          <span className="hero-fade label hidden text-right md:col-span-2 md:block">
            Scroll ↓
          </span>
        </div>
        <motion.p
          style={{ scale: nameScale, y: nameY, transformOrigin: "50% 100%" }}
          className="display mt-4 -mb-[0.06em] overflow-hidden text-[16.8vw] font-semibold whitespace-nowrap md:mt-2 md:text-[16.4vw]"
          aria-label={profile.name}
        >
          {profile.name.split("").map((ch, i) => (
            <span key={i} className="hero-char inline-block" aria-hidden>
              <span className="name-char inline-block origin-bottom">{ch === " " ? "\u00a0" : ch}</span>
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
