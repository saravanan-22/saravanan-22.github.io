"use client";

import { useEffect, useRef } from "react";
import { store } from "@/lib/store";

/*
 * Full-screen drone footage over a misty mountain range at sunrise.
 * Footage: "Aerial Sunrise Over Misty Mountain Range" by Tom Fisk, Pexels
 * (free to use under the Pexels license).
 *
 * Scroll drives a slow camera move: the shot pushes in and drifts upward as if
 * descending, and dims behind reading content. Scrolling fast speeds up the
 * flight. The mouse adds a gentle parallax.
 */
export default function CinematicVideo() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    const w = wrap.current;
    if (!v || !w) return;

    // Lighter file for phones and data-saver connections.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const small = window.innerWidth < 1100 || conn?.saveData;
    v.src = small ? "/media/mountains-720.mp4" : "/media/mountains-1080.mp4";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = () => {
      w.style.setProperty("--ready", "1");
      store.sceneReady = true; // lets the loader finish
    };
    v.addEventListener("loadeddata", show, { once: true });
    if (reduced) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }

    // Pause when the tab is hidden.
    const onVis = () => {
      if (document.hidden) v.pause();
      else if (!reduced) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    let lastY = window.scrollY;
    let speed = 0;
    let mx = 0;
    let my = 0;
    let scroll = 0;
    const loop = () => {
      const vh = window.innerHeight;
      const y = store.scrollY;
      // smoothed values
      scroll += (y / vh - scroll) * 0.08;
      const dy = Math.abs(y - lastY);
      lastY = y;
      speed += (Math.min(dy / 40, 1.6) - speed) * 0.06;
      mx += ((store.pointerActive ? store.mouseX : 0) - mx) * 0.04;
      my += ((store.pointerActive ? store.mouseY : 0) - my) * 0.04;

      // camera: push in over the first screens, then keep a slow descent
      const p = store.progress;
      const push = Math.min(scroll / 2, 1);
      const scale = 1.04 + push * 0.18 + p * 0.2;
      const tx = reduced ? 0 : -mx * 14;
      const ty = (reduced ? 0 : my * 12) - push * 4 - p * 6; // vh-ish percentages below
      w.style.transform = `translate3d(${tx}px, ${ty}%, 0) scale(${scale})`;

      // grade: footage stays clear everywhere; text gets its own shadow instead
      const bright = 0.95 - push * 0.07;
      w.style.setProperty("--bright", bright.toFixed(3));

      if (!reduced && !v.paused) {
        const rate = 1 + speed * 1.5;
        if (Math.abs(v.playbackRate - rate) > 0.02) v.playbackRate = rate;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("loadeddata", show);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="absolute inset-0 origin-[50%_40%] opacity-[var(--ready,0)] transition-opacity duration-[2000ms] will-change-transform"
    >
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover [filter:brightness(var(--bright,1))_contrast(1.06)_saturate(1.08)]"
      />
    </div>
  );
}
