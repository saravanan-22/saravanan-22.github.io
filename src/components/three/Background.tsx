"use client";

import dynamic from "next/dynamic";

// The WebGL globe only runs in the browser and loads after the page content.
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 bg-black" aria-hidden>
      <Globe />
    </div>
  );
}
