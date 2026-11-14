"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children on a fixed-size design canvas (w × h) and scales it to fit
 * the parent, so illustrations keep their proportions at any screen size.
 */
export default function FitBox({
  w,
  h,
  max = 1.25,
  children,
}: {
  w: number;
  h: number;
  max?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setScale(Math.min(el.clientWidth / w, el.clientHeight / h, max))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, max]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: w,
          height: h,
          transform: `translate(-50%, -50%) scale(${scale})`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
