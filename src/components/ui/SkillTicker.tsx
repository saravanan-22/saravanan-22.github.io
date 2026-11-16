import { skills } from "@/lib/content";

/**
 * A quiet market-style ticker between About and Stack: technology on the top
 * row, lending know-how in gold below, sliding in opposite directions. Pure CSS;
 * hover pauses it and reduced-motion users get a static strip. The full skill
 * list lives in the Stack section, so this stays decorative.
 */

const clean = (s: string) => s.replace(/\s*\(.*?\)\s*/g, " ").trim();
const pick = (groups: string[]) => [
  ...new Set(skills.filter((g) => groups.includes(g.group)).flatMap((g) => g.items.map(clean))),
];

const TECH = pick(["Languages", "Back end", "AI / OCR", "Front end", "Cloud & tools"]);
const DOMAIN = pick(["Lending domain", "Integrations"]);

function Row({ items, reverse = false, gold = false }: { items: string[]; reverse?: boolean; gold?: boolean }) {
  const run = (copy: number) => (
    <ul aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={t} className="flex items-center">
          <span
            className={
              gold
                ? "font-mono text-[0.8rem] tracking-[0.14em] text-gold/85 uppercase md:text-sm"
                : `display text-4xl md:text-6xl ${
                    i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgb(237_232_224/0.45)]" : "text-bone"
                  }`
            }
          >
            {t}
          </span>
          <span aria-hidden className={`mx-6 rotate-45 bg-gold md:mx-10 ${gold ? "h-1 w-1" : "h-1.5 w-1.5"}`} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="ticker-mask flex overflow-hidden">
      <div className={`ticker flex w-max ${reverse ? "ticker-rev" : ""}`} style={{ animationDuration: gold ? "70s" : "55s" }}>
        {run(0)}
        {run(1)}
      </div>
    </div>
  );
}

export default function SkillTicker() {
  return (
    <section aria-label="Skills at a glance" className="relative py-16 md:py-24">
      <div className="mb-8 flex items-center justify-between px-5 md:mb-10 md:px-10">
        <p className="label">At a glance</p>
        <p className="label">Tech · Lending</p>
      </div>
      <div className="hairline flex flex-col gap-5 border-y py-8 md:gap-7 md:py-10">
        <Row items={TECH} />
        <Row items={DOMAIN} reverse gold />
      </div>
    </section>
  );
}
