"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { store } from "@/lib/store";

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    store.reduced = reduced;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      store.scrollY = window.scrollY;
      store.progress = max > 0 ? window.scrollY / max : 0;
    };

    if (reduced) {
      window.addEventListener("scroll", update, { passive: true });
      update();
      return () => window.removeEventListener("scroll", update);
    }

    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.085 });
    store.lenis = lenis;
    if (!store.introDone) lenis.stop();
    lenis.on("scroll", update);
    update();

    return () => {
      lenis.destroy();
      store.lenis = null;
    };
  }, []);

  return null;
}
