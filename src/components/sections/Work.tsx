"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { learningProjects, loanDocs, loanDocsApi } from "@/lib/content";
import Reveal, { MaskLine, SectionLabel } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/SectionTitle";
import DocFan from "@/components/visuals/DocFan";
import { Blinds, CalcDemo, MatchDemo, MergeDemo, ValidatorDemo } from "@/components/visuals/ModuleDemos";
import { BuildGraph, Pipeline, StackOrbit } from "@/components/visuals/LoanDocsAnimations";

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

/** A small API console that cycles through Read → Calculate → Generate. */
function ApiPanel() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setActive((a) => (a + 1) % loanDocsApi.length), 5200);
    return () => clearInterval(id);
  }, [auto]);

  const call = loanDocsApi[active];

  return (
    <div className="hairline overflow-hidden rounded-md border bg-ink/55 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] backdrop-blur">
      <div className="hairline flex items-center justify-between gap-4 border-b px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
        </div>
        <div role="tablist" aria-label="Sample API calls" className="flex gap-1">
          {loanDocsApi.map((c, i) => (
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

function LoanDocs() {
  const p = loanDocs;
  return (
    <article>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <p className="label flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
          Main project · {p.status} · Started {p.started}
        </p>
        <p className="label">{p.license} · Self-hosted</p>
      </Reveal>

      <h3 className="display mt-6 text-[22vw] md:text-[13vw]">
        <MaskLine>
          Loan<span className="accent">Docs</span>
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
        <div className="flex flex-col gap-10 md:col-span-5">
          <Reveal>
            <p className="label mb-3">The problem</p>
            <p className="text-lg leading-relaxed text-bone/75">{p.problem}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="label mb-3">What I’m building</p>
            <p className="text-lg leading-relaxed text-bone/75">{p.solution}</p>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-wrap gap-x-8 gap-y-3 text-lg">
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noreferrer" className="link-draw">
                Code on GitHub ↗
              </a>
            ) : (
              <span className="text-bone/40">GitHub repo: coming soon</span>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer" className="link-draw">
                Live demo ↗
              </a>
            )}
          </Reveal>
        </div>
        <Reveal delay={0.08} className="md:col-span-7">
          <ApiPanel />
          <p className="label mt-3">Planned REST API · sample data only</p>
        </Reveal>
      </div>

      {/* Modules */}
      <div className="mt-20 grid overflow-hidden rounded-sm border-t border-l border-bone/15 md:mt-28 md:grid-cols-2">
        {p.modules.map((m, i) => (
          <div key={m.name} className="relative h-full">
            <Blinds />
            <div className="group flex h-full flex-col border-r border-b border-bone/15 bg-ink/45 backdrop-blur-md p-7 transition-colors duration-500 hover:bg-ink/60 md:p-10">
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
                {i === 1 && <MatchDemo />}
                {i === 2 && <MergeDemo />}
                {i === 3 && <CalcDemo />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it fits together: live pipeline */}
      <div className="mt-20 md:mt-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <p className="label">How the parts fit together</p>
          <p className="label">Live run · sample document</p>
        </Reveal>
        <Pipeline />
      </div>

      {/* Tech stack orbit */}
      <div className="mt-24 grid items-center gap-10 md:mt-32 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="label mb-5">Tech stack</p>
          <h4 className="display text-5xl md:text-[4vw]">
            Free, offline, <span className="accent">self-hosted</span>.
          </h4>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/65">
            A Go core with open-source OCR and PDF engines around it. One Docker Compose command runs
            everything, so customer data never leaves the lender’s own server.
          </p>
          <p className="label mt-6">Inner ring: back end · Outer ring: OCR, PDF, front end, packaging</p>
        </Reveal>
        <div className="md:col-span-6 md:col-start-7">
          <StackOrbit />
        </div>
      </div>

      {/* 8-week plan as a commit graph */}
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
        parts={[{ text: "Things I’m " }, { text: "building", accent: true }, { text: "." }]}
      />
      <LoanDocs />
      <LearningProjects />
    </section>
  );
}
