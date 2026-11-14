"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { profile } from "@/lib/content";
import Magnetic from "@/components/ui/Magnetic";

const field =
  "peer w-full border-0 border-b border-bone/15 bg-transparent pt-7 pb-3 text-xl tracking-tight text-bone outline-none transition-colors placeholder:text-transparent focus:border-gold md:text-2xl";
const label =
  "label pointer-events-none absolute top-7 left-0 transition-all duration-300 peer-focus:top-0 peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0";

/**
 * Message form. There is no backend yet, so sending opens the visitor's
 * email app with the message filled in, addressed to profile.email.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="relative">
        <input
          id="cf-name"
          required
          placeholder="Your name"
          className={field}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label htmlFor="cf-name" className={label}>
          Your name
        </label>
      </div>
      <div className="relative">
        <input
          id="cf-email"
          required
          type="email"
          placeholder="Your email"
          className={field}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label htmlFor="cf-email" className={label}>
          Your email
        </label>
      </div>
      <div className="relative">
        <textarea
          id="cf-message"
          required
          rows={4}
          placeholder="Tell me about your project"
          className={`${field} resize-none`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <label htmlFor="cf-message" className={label}>
          Tell me about your project
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <Magnetic>
          <button
            type="submit"
            className="inline-flex items-center gap-3 rounded-full bg-bone px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-gold"
          >
            Send message <span aria-hidden>→</span>
          </button>
        </Magnetic>
        <AnimatePresence>
          {sent && (
            <motion.p
              className="label"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Opening your email app…
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
