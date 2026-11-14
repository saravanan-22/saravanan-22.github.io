"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*/<>";

/**
 * Text that scrambles on hover of its nearest `.group` parent and resolves
 * left to right. The original word stays in the layout (invisible) so the
 * width never jumps.
 */
export default function ScrambleText({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = () => {
    if (timer.current) clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame++;
      const settled = Math.floor(frame / 2);
      setOut(
        text
          .split("")
          .map((c, i) => (c === " " || i < settled ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (settled >= text.length && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 32);
  };

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <span className="relative inline-grid" onMouseEnter={run} onFocus={run}>
      <span className="invisible col-start-1 row-start-1">{text}</span>
      <span aria-hidden className="col-start-1 row-start-1 whitespace-nowrap">
        {out}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
