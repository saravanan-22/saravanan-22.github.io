"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { learningProjects, lendOcr, lendOcrApi } from "@/lib/content";
import Reveal, { MaskLine, SectionLabel } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/SectionTitle";
import DocFan from "@/components/visuals/DocFan";
import { Blinds, KeysDemo, QueueDemo, StatementDemo, ValidatorDemo } from "@/components/visuals/ModuleDemos";
import { BuildGraph, Pipeline, StackOrbit } from "@/components/visuals/LendOcrAnimations";

const pad = (n: number) => String(n).padStart(2, "0");

/** Minimal JSON colouring: keys, strings, numbers and the trailing status line. */
function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|(→.*$)/gm;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const key = m.index;
    if (m[1] && m[2]) {
      out.push(
        <span key={key} className="text-bone/90">
          {m[1]}
        </span>,
        m[2]
      );
    } else if (m[1]) {
      out.push(
        <span key={key} className="text-gold">
          {m[1]}
        </span>
      );
    } else if (m[3]) {
      out.push(
        <span key={key} className="text-[#9cc4a4]">
          {m[3]}
        </span>
      );
    } else {
      out.push(
        <span key={key} className="text-[#9cc4a4]">
          {m[4]}
        </span>
      );
    }
    last = re.lastIndex;
  }
  out.push(src.slice(last));
  return out;
}

/** A small API console that cycles through real LendOCR responses. */
function ApiPanel() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setActive((a) => (a + 1) % lendOcrApi.length), 5200);
    return () => clearInterval(id);
  }, [auto]);

  const call = lendOcrApi[active];

  return (
    <div className="hairline overflow-hidden rounded-md border bg-[#0f0e0c]/90 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] backdrop-blur">
      <div className="hairline flex items-center justify-between gap-4 border-b px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
        </div>
        <div role="tablist" aria-label="Sample API calls" className="flex gap-1">
          {lendOcrApi.map((c, i) => (
            <button
              key={c.label}
              role="tab"
              aria-selected={i === active}
              onClick={() => {
                setActive(i);
                setAuto(false);
              }}
              className={`rounded-full px-3 py-1 font-mono text-[0.68rem] tracking-[0.08em] uppercase transition-colors ${
                i === active ? "bg-bone text-ink" : "text-muted hover:text-bone"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[25rem] overflow-hidden p-5 font-mono text-[12.5px] leading-[1.65] md:h-[26rem] md:p-6 md:text-[13px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={call.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-4 text-bone">
              <span className="text-muted">$ </span>
              {call.request}
            </p>
            <pre className="overflow-x-auto whitespace-pre text-bone/55">{highlight(call.response)}</pre>
          </motion.div>
        </AnimatePresence>
        {auto && (
          <motion.span
            key={`bar-${active}`}
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5.2, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

function LendOcr() {
  const p = lendOcr;
  return (
    <article>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <p className="label flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
          Main project · {p.status} · Started {p.started}
        </p>
        <p className="label">{p.label}</p>
      </Reveal>

      <h3 className="display mt-6 text-[22vw] md:text-[13vw]">
        <MaskLine>
          Lend<span className="accent">OCR</span>
        </MaskLine>
      </h3>

      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="text-2xl tracking-tight md:text-3xl">{p.subtitle}</p>
        </Reveal>
        <Reveal delay={0.06} className="md:col-span-6 md:col-start-7">
          <p className="text-lg leading-relaxed text-bone/70">{p.oneLiner}</p>
        </Reveal>
      </div>

      <DocFan />

      {/* Problem / solution + live API console */}
      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-10 md:col-span-5">
          <Reveal>
            <p className="label mb-3">The problem</p>
            <p className="text-lg leading-relaxed text-bone/75">{p.problem}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="label mb-3">What I built</p>
            <p className="text-lg leading-relaxed text-bone/75">{p.solution}</p>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-wrap gap-x-8 gap-y-3 text-lg">
            <a href={p.site} target="_blank" rel="noreferrer" className="link-draw">
              Product website ↗
            </a>
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noreferrer" className="link-draw">
                Code on GitHub ↗
              </a>
            ) : (
              <span className="text-bone/40">Code: private repo, walkthrough on request</span>
            )}
          </Reveal>
        </div>
        <Reveal delay={0.08} className="min-w-0 md:col-span-7">
          <ApiPanel />
          <p className="label mt-3">Real API responses · synthetic sample documents</p>
        </Reveal>
      </div>

      {/* Measured results */}
      <div className="mt-20 md:mt-28">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-bone/12 bg-bone/12 md:grid-cols-4">
          {p.results.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.05} className="bg-ink p-6 md:p-8">
              <p className="display text-4xl text-gold md:text-5xl">{r.value}</p>
              <p className="label mt-3">{r.label}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-bone/45">{p.resultsNote}</p>
      </div>

      {/* Modules */}
      <div className="mt-20 grid gap-px overflow-hidden rounded-sm border border-bone/12 bg-bone/12 md:mt-28 md:grid-cols-2">
        {p.modules.map((m, i) => (
          <div key={m.name} className="relative h-full">
            <Blinds />
            <div className="group flex h-full flex-col bg-ink p-7 transition-colors duration-500 hover:bg-[#141311] md:p-10">
              <div className="flex justify-between">
                <span className="label">{pad(i + 1)}</span>
                <span className="label !text-gold">{m.tag}</span>
              </div>
              <h4 className="display mt-8 text-4xl md:text-5xl">{m.name}</h4>
              <ul className="mt-6 space-y-3 leading-relaxed text-bone/65">
                {m.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="text-gold" aria-hidden>
                      —
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {i === 0 && <ValidatorDemo />}
                {i === 1 && <StatementDemo />}
                {i === 2 && <KeysDemo />}
                {i === 3 && <QueueDemo />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it fits together: live pipeline */}
      <div className="mt-20 md:mt-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <p className="label">How the parts fit together</p>
          <p className="label">One request, and a bulk job</p>
        </Reveal>
        <Pipeline />
      </div>

      {/* Tech stack orbit */}
      <div className="mt-24 grid items-center gap-10 md:mt-32 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="label mb-5">Tech stack</p>
          <h4 className="display text-5xl md:text-[4vw]">
            Open-source models, <span className="accent">production</span> plumbing.
          </h4>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/65">
            A Python FastAPI service around free OCR models: RapidOCR on the GPU for speed, and
            PaddleOCR-VL on vLLM for hard images. Postgres holds keys, usage and the job queue, nginx
            spreads load over replicas, and one Docker Compose command runs it all on a lender’s own
            servers.
          </p>
          <p className="label mt-6">Inner ring: core API · Outer ring: OCR models, infrastructure, monitoring, CI</p>
        </Reveal>
        <div className="md:col-span-6 md:col-start-7">
          <StackOrbit />
        </div>
      </div>

      {/* Real build history as a commit graph */}
      <div className="mt-24 md:mt-32">
        <BuildGraph />
      </div>
    </article>
  );
}

function LearningProjects() {
  return (
    <div className="mt-32 md:mt-48">
      <Reveal className="mb-6 flex items-end justify-between gap-6">
        <p className="label">Where I started</p>
        <p className="label">Learning projects</p>
      </Reveal>

      {learningProjects.map((p) => (
        <Reveal key={p.name}>
          <article className="hairline grid gap-8 border-t pt-8 md:grid-cols-12 md:gap-10 md:pt-10">
            <motion.a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              aria-label={`Open ${p.name} live site`}
              className="hairline group relative block aspect-[16/10] overflow-hidden rounded-sm border md:col-span-5"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <Image
                src={p.image}
                alt={`${p.name} screenshot`}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover object-top grayscale-[40%] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
              />
            </motion.a>
            <div className="flex flex-col justify-between gap-6 md:col-span-7">
              <div>
                <p className="label">
                  {p.year} · Learning project · {p.stack}
                </p>
                <h3 className="display mt-4 text-4xl md:text-6xl">{p.name}</h3>
                <p className="accent mt-3 text-xl md:text-2xl">{p.note}</p>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone/65">{p.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <ul className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li key={t} className="hairline rounded-full border px-3 py-1 text-xs text-bone/60">
                      {t}
                    </li>
                  ))}
                </ul>
                <a href={p.live} target="_blank" rel="noreferrer" className="link-draw text-lg">
                  Visit live site ↗
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative px-5 pt-28 pb-10 md:px-10 md:pt-40">
      <SectionLabel index="05" title="Projects" />
      <AnimatedHeading
        variant="assemble"
        className="mb-16 text-[13vw] md:mb-24 md:text-[7vw]"
        parts={[{ text: "Things I’ve " }, { text: "built", accent: true }, { text: "." }]}
      />
      <LendOcr />
      <LearningProjects />
    </section>
  );
}
