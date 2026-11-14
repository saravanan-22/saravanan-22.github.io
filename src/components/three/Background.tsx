"use client";

import CinematicVideo from "./CinematicVideo";

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden>
      <CinematicVideo />
    </div>
  );
}
