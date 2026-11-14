"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** The two heading lines slide in from opposite sides, scrubbed by scroll. */
export default function ContactHeading() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 65%"] });
  const left = useTransform(scrollYProgress, [0, 1], ["-45%", "0%"]);
  const right = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <h2 ref={ref} className="display overflow-hidden text-[14vw] md:text-[10vw]">
      <motion.span style={{ x: left, opacity }} className="block pb-[0.08em]">
        Let’s build
      </motion.span>
      <motion.span style={{ x: right, opacity }} className="block pb-[0.08em] md:text-right">
        <span className="accent">something</span> together.
      </motion.span>
    </h2>
  );
}
