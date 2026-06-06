"use client";

import { useState } from "react";
import { site, formSubmitUrl } from "@/data/site";
import { MagneticButton } from "./MagneticButton";
import { Feedback } from "./Feedback";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Contact section + footer.
 * Visitor leaves name (required) + email + message → POSTs to FormSubmit.co,
 * which emails Armaan. No backend, no API key. Honeypot guards spam.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botcheck, setBotcheck] = useState("");

  const year = new Date().getFullYear();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (botcheck) return; // bot filled the honeypot — silently drop
    if (!name.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch(formSubmitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _template: "table",
          _captcha: "false",
          _honey: botcheck, // FormSubmit honeypot
        }),
      });
      const data = await res.json();
      setStatus(String(data?.success) === "true" ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative border-t border-[var(--rule)] px-6 sm:px-8 md:px-16 py-20 md:py-32"
      aria-label="Contact"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Eyebrow */}
        <p className="mono mb-8 md:mb-12">Contact — say hello</p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* LEFT — headline + socials + resume */}
          <div className="md:col-span-6">
            <h2
              className="serif-it"
              style={{
                fontSize: "clamp(48px, 11vw, 132px)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              Let&rsquo;s build
              <br />
              something.
            </h2>

            <p className="mt-8 max-w-[420px] text-[15px] leading-relaxed text-[var(--muted)]">
              Have a project, a role, or just want to say hi? Leave your name
              and I&rsquo;ll know you stopped by. I read every message.
            </p>

            {/* Download resume */}
            <div className="mt-10">
              <MagneticButton
                href={site.resumeUrl}
                download
                className="inline-flex items-center justify-center rounded-full border border-[var(--text)] px-6 py-3 text-sm font-medium transition-colors duration-300 hover:bg-[var(--text)] hover:text-[var(--bg)]"
              >
                Download résumé&nbsp;&nbsp;↓
              </MagneticButton>
            </div>

            {/* Socials */}
            <ul className="mt-12 space-y-px">
              {site.socials.map((s) => (
                <li key={s.label} className="border-t border-[var(--rule)]">
                  <MagneticButton
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    strength={0.18}
                    className="group flex w-full items-center justify-between py-4"
                  >
                    <span className="serif-it text-2xl md:text-3xl transition-transform duration-300 group-hover:translate-x-2">
                      {s.label}
                    </span>
                    <span className="mono opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                      {s.handle}&nbsp;&nbsp;↗
                    </span>
                  </MagneticButton>
                </li>
              ))}
              {/* Email row */}
              <li className="border-t border-b border-[var(--rule)]">
                <MagneticButton
                  href={`mailto:${site.email}`}
                  strength={0.18}
                  className="group flex w-full items-center justify-between py-4"
                >
                  <span className="serif-it text-2xl md:text-3xl transition-transform duration-300 group-hover:translate-x-2">
                    Email
                  </span>
                  <span className="mono opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                    {site.email}&nbsp;&nbsp;↗
                  </span>
                </MagneticButton>
              </li>
            </ul>
          </div>

          {/* RIGHT — form */}
          <div className="md:col-span-6 md:col-start-8">
            {status === "success" ? (
              <div className="flex h-full min-h-[280px] flex-col justify-center">
                <p className="mono mb-4 text-[var(--accent)]">Message sent</p>
                <p
                  className="serif-it"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05 }}
                >
                  Thanks, {name.split(" ")[0] || "friend"}.
                  <br />
                  I&rsquo;ll be in touch.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-8">
                {/* Honeypot — visually hidden, off the tab order */}
                <input
                  type="text"
                  name="botcheck"
                  value={botcheck}
                  onChange={(e) => setBotcheck(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />

                <Field
                  label="Your name *"
                  value={name}
                  onChange={setName}
                  placeholder="Armaan Sekhon"
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@email.com"
                />
                <div className="flex flex-col gap-3">
                  <label className="mono" htmlFor="c-message">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="What's on your mind?"
                    className="resize-none border-b border-[var(--rule)] bg-transparent pb-3 text-lg outline-none transition-colors duration-300 placeholder:text-[var(--muted)]/50 focus:border-[var(--text)]"
                  />
                </div>

                {status === "error" && (
                  <p className="mono text-[var(--accent)]">
                    Something broke.{" "}
                    <a className="underline" href={`mailto:${site.email}`}>
                      Email me directly
                    </a>
                    .
                  </p>
                )}

                <MagneticButton
                  as="button"
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center self-start rounded-full bg-[var(--text)] px-8 py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity duration-300 disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>

        {/* Rate this site */}
        <Feedback />

        {/* Footer */}
        <div className="mt-24 flex flex-col gap-4 border-t border-[var(--rule)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono">
            © {year} {site.name} — {site.role}
          </p>
          <a href="#top" className="mono opacity-60 transition-opacity hover:opacity-100" data-cursor="hover">
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----- Field ----- */
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  const id = `c-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-3">
      <label className="mono" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-[var(--rule)] bg-transparent pb-3 text-lg outline-none transition-colors duration-300 placeholder:text-[var(--muted)]/50 focus:border-[var(--text)]"
      />
    </div>
  );
}
