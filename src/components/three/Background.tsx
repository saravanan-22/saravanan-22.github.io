"use client";

import dynamic from "next/dynamic";

// The WebGL map only runs in the browser and loads after the page content.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Background() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Scene />
    </div>
  );
}
