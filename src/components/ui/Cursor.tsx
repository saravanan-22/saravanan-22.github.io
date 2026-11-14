"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { store } from "@/lib/store";

type Mode = "default" | "hover" | "view";

const FINE_POINTER = "(pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Difference-blend dot that trails the pointer, grows over interactive
 * elements and turns into a "View" disc over project media.
 */
export default function Cursor() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false
  );
  const el = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  // Feed pointer position to the WebGL map on every device.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") store.pointerActive = true;
      store.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      store.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
    };
    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest('[data-cursor="view"]')) setMode("view");
      else if (t?.closest('a, button, input, textarea, [data-cursor="hover"]')) setMode("hover");
      else setMode("default");
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);

    const loop = () => {
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      if (el.current) el.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={el}
      className="cursor"
      data-mode={mode}
      data-down={down}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div className="cursor-inner">
        <span className="cursor-label">View</span>
      </div>
    </div>
  );
}
