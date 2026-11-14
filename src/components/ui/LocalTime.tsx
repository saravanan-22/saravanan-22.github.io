"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

/** Live local time in Tiruppur (IST). Renders a placeholder until mounted. */
export default function LocalTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const first = setTimeout(() => setTime(fmt()), 0);
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{time} IST</span>;
}
