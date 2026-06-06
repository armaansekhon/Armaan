"use client";

import { useState } from "react";
import { formSubmitUrl } from "@/data/site";
import { MagneticButton } from "./MagneticButton";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Lightweight "Rate this site" widget. Tap 1–5 stars + an optional note,
 * and it emails the rating via FormSubmit (no DB, no key, same inbox).
 * Distinct subject so ratings are easy to spot in the inbox.
 */
export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit() {
    if (botcheck || rating === 0) return;
    setStatus("submitting");
    try {
      const res = await fetch(formSubmitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `⭐ ${rating}/5 — portfolio rating${from ? ` from ${from}` : ""}`,
          _template: "table",
          _captcha: "false",
          rating: `${rating}/5`,
          name: from || "Anonymous",
          message: note || "(no note)",
          _honey: botcheck,
        }),
      });
      const data = await res.json();
      setStatus(String(data?.success) === "true" ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const shown = hover || rating;

  return (
    <div className="mt-24 border-t border-[var(--rule)] pt-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {/* Left — prompt + stars */}
        <div>
          <p className="mono mb-4">Rate this site</p>
          {status === "success" ? (
            <p className="serif-it" style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05 }}>
              Thanks for the {rating}★ — noted.
            </p>
          ) : (
            <div
              className="flex items-center gap-2"
              onMouseLeave={() => setHover(0)}
              role="radiogroup"
              aria-label="Rate this site out of five"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  data-cursor="hover"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-checked={rating === n}
                  role="radio"
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                  className="leading-none transition-transform duration-200 hover:scale-110"
                  style={{
                    fontSize: "clamp(34px, 5vw, 52px)",
                    color: n <= shown ? "var(--accent)" : "var(--rule)",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — optional note + name + send (hidden once rated → expands) */}
        {status !== "success" && rating > 0 && (
          <div className="flex w-full max-w-[420px] flex-col gap-3">
            {/* honeypot */}
            <input
              type="text"
              value={botcheck}
              onChange={(e) => setBotcheck(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What stood out? (optional)"
              className="border-b border-[var(--rule)] bg-transparent pb-2 text-base outline-none transition-colors duration-300 placeholder:text-[var(--muted)]/50 focus:border-[var(--text)]"
            />
            <div className="flex items-center gap-3">
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Your name (optional)"
                className="flex-1 border-b border-[var(--rule)] bg-transparent pb-2 text-base outline-none transition-colors duration-300 placeholder:text-[var(--muted)]/50 focus:border-[var(--text)]"
              />
              <MagneticButton
                as="button"
                type="button"
                onClick={submit}
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center rounded-full bg-[var(--text)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity duration-300 disabled:opacity-50"
              >
                {status === "submitting" ? "Sending…" : "Send"}
              </MagneticButton>
            </div>
            {status === "error" && (
              <p className="mono text-[var(--accent)]">Couldn&rsquo;t send — try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
