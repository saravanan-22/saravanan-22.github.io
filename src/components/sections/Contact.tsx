import { profile } from "@/lib/content";
import LocalTime from "@/components/ui/LocalTime";
import Odometer from "@/components/ui/Odometer";
import Reveal, { SectionLabel } from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";
import ContactHeading from "./ContactHeading";

export default function Contact() {
  return (
    <section id="contact" className="relative flex min-h-svh flex-col px-5 pt-28 pb-6 md:px-10 md:pt-40">
      <SectionLabel index="08" title="Contact" />

      <ContactHeading />

      <div className="mt-16 mb-24 grid gap-14 md:mt-24 md:grid-cols-12">
        <Reveal className="flex flex-col gap-10 md:col-span-4">
          <p className="label">{profile.availability}</p>
          <Odometer />
          <div>
            <p className="label mb-3">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="link-draw text-2xl font-medium tracking-tight break-all md:text-3xl"
            >
              {profile.email}
            </a>
          </div>
          <div>
            <p className="label mb-3">Elsewhere</p>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link-draw text-2xl font-medium tracking-tight md:text-3xl"
            >
              LinkedIn ↗
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-7 md:col-start-6">
          <p className="label mb-2">Send a message</p>
          <ContactForm />
        </Reveal>
      </div>

      <footer className="hairline label mt-auto grid grid-cols-2 gap-4 border-t pt-5 md:grid-cols-12">
        <span className="md:col-span-3">© 2026 {profile.name}</span>
        <span className="hidden md:col-span-3 md:block">
          Local time <LocalTime />
        </span>
        <span className="hidden md:col-span-4 md:block">Built with Next.js, WebGL & GSAP</span>
        <a href="#top" className="text-right md:col-span-2">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
