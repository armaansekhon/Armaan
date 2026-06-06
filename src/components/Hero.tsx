"use client";

import { useEffect, useState } from "react";
import { MorphingMockup } from "./MorphingMockup";
import { FadeIn } from "./FadeIn";
import { useLenis } from "./SmoothScroll";

const NAME_PART = "I'm Armaan Sekhon.";
const TAGLINE = "I build software experiences that feel alive.";
const TYPE_MS = 64;
const REVEAL_DELAY_MS = 420;
const LETTER_STAGGER_MS = 18;
const LOAD_DURATION_MS = 2400;

export function Hero() {
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();

  // Track small screens so the row layout can stack on mobile.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Reduced-motion → skip the whole gated intro, render the final state.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setShown(NAME_PART.length);
      setTyped(true);
      setLoaded(true);
      setRevealing(true);
      setRevealed(true);
    }
  }, []);

  // Typewriter
  useEffect(() => {
    if (reduced) return;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        setShown((s) => {
          if (s >= NAME_PART.length) {
            clearInterval(id);
            setTyped(true);
            return s;
          }
          return s + 1;
        });
      }, TYPE_MS);
      return () => clearInterval(id);
    }, 450);
    return () => clearTimeout(start);
  }, [reduced]);

  // Progress bar — fills over LOAD_DURATION_MS, mimics asset loading
  useEffect(() => {
    if (reduced || !typed || revealed) return;
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - start) / LOAD_DURATION_MS) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setLoaded(true);
      }
    }, 60);
    return () => clearInterval(id);
  }, [reduced, typed, revealed]);

  // Reveal — both gates: typing done AND loading complete
  useEffect(() => {
    if (!typed || !loaded || revealed) return;
    const t1 = setTimeout(() => setRevealing(true), REVEAL_DELAY_MS);
    const t2 = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS + 220);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [typed, loaded, revealed]);

  // SAFETY: never trap the user.
  //  (1) Any scroll/touch/key/click intent during the intro completes it now.
  //  (2) A hard failsafe forces reveal even if timers are throttled (bg tab).
  useEffect(() => {
    if (revealed) return;
    const finish = () => {
      setShown(NAME_PART.length);
      setTyped(true);
      setLoaded(true);
      setRevealing(true);
      setRevealed(true);
    };
    const failsafe = setTimeout(finish, 6000);
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("wheel", finish, opts);
    window.addEventListener("touchmove", finish, opts);
    window.addEventListener("keydown", finish);
    return () => {
      clearTimeout(failsafe);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchmove", finish);
      window.removeEventListener("keydown", finish);
    };
  }, [revealed]);

  // Lock page scroll until reveal fires (never when reduced-motion).
  // Prefer Lenis stop/start; fall back to overflow:hidden before Lenis mounts.
  useEffect(() => {
    if (reduced) return;
    if (lenis) {
      if (revealed) lenis.start();
      else lenis.stop();
      return;
    }
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = revealed ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = original;
    };
  }, [revealed, reduced, lenis]);

  return (
    <section className="relative min-h-[100dvh] flex items-center px-6 sm:px-8 md:px-16 py-16 overflow-hidden">
      {/* Violet wave sweep — only plays once during reveal */}
      <div className={`reveal-wave ${revealing ? "play" : ""}`} aria-hidden />

      {/* PROGRESS BLOCK — big editorial number, funky label, segmented dots.
          Wrapper handles centering; inner column handles fade/lift. */}
      <div
        className="absolute right-4 bottom-6 md:right-8 md:bottom-10 z-20 pointer-events-none flex justify-end"
        aria-hidden
      >
        <div
          className="flex flex-col items-end"
          style={{
            opacity: typed && !revealed ? 1 : 0,
            transform: `translateY(${typed && !revealed ? 0 : 10}px) scale(${revealed ? 0.96 : 1})`,
            transition:
              "opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Big italic serif percentage */}
          <div
            className="serif-it flex items-baseline"
            style={{
              fontSize: "clamp(44px, 12vw, 122px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span style={{ minWidth: "2.4ch", textAlign: "right" }}>{progress}</span>
            <span
              className="text-[var(--muted)]"
              style={{ fontSize: "0.42em", marginLeft: "0.08em" }}
            >
              %
            </span>
          </div>

          <p className="mono mt-3 text-right" style={{ letterSpacing: "0.22em" }}>
            Preparing portfolio
          </p>

          {/* Segmented dots — fewer on small screens */}
          <div className="flex gap-1.5 mt-5">
            {Array.from({ length: 16 }).map((_, i) => {
              const filled = progress >= (i + 1) * (100 / 16);
              return (
                <span
                  key={i}
                  className={`${i >= 8 ? "hidden sm:block" : "block"} w-1.5 h-1.5 rounded-full`}
                  style={{
                    background: filled ? "var(--text)" : "var(--rule)",
                    transform: filled ? "scale(1.25)" : "scale(1)",
                    transition:
                      "background 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10 w-full max-w-[1500px] mx-auto">
        {/* LEFT — text column */}
        <div
          className="transition-[width] ease-out w-full"
          style={{
            width: isMobile ? "100%" : revealed ? "62%" : "100%",
            transitionDuration: "1300ms",
          }}
        >
          {/* Header strip */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <p className="mono">Armaan Sekhon &nbsp;/&nbsp; Software Developer · 2026</p>
            <FadeIn show={revealed} delay={0}>
              <StatusPill />
            </FadeIn>
          </div>

          {/* H1 area — intro or tagline */}
          <div className="relative">
            {/* INTRO — two lines: greeting / name part */}
            <div
              className={revealing ? "intro-exit" : ""}
              style={{
                opacity: revealed ? 0 : 1,
                position: revealed ? "absolute" : "static",
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: revealed ? "none" : "auto",
              }}
            >
              {/* Line 1 — quiet greeting */}
              <h1
                className="serif-it intro-greeting"
                style={{
                  fontSize: "clamp(40px, 11vw, 168px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                <span lang="en">Hi</span>
                <span lang="en" className="opacity-30">,</span>
              </h1>
              {/* Line 2 — typewriter */}
              <h1
                className="serif-it"
                lang="en"
                style={{
                  fontSize: "clamp(40px, 11vw, 168px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  margin: "0.06em 0 0 0",
                }}
              >
                {NAME_PART.slice(0, shown)}
                {!revealed && <span className="cursor cursor-pulse" aria-hidden />}
              </h1>
            </div>

            {/* TAGLINE — letter-stagger reveal */}
            <h1
              className="serif-it"
              lang="en"
              style={{
                fontSize: "clamp(34px, 9vw, 132px)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                position: revealed ? "static" : "absolute",
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: revealed ? "auto" : "none",
              }}
            >
              <StaggerLetters text={TAGLINE} play={revealed} />
            </h1>
          </div>

          {/* Subtitle */}
          <FadeIn show={revealed} delay={650}>
            <p className="mt-10 max-w-[520px] text-[15px] leading-relaxed text-[var(--muted)]">
              React Native engineer building production apps across{" "}
              <span className="text-[var(--text)]">mobile</span>,{" "}
              <span className="text-[var(--text)]">web</span>, and{" "}
              <span className="text-[var(--text)]">AI</span> — currently shipping at
              CodeBrew Labs.
            </p>
          </FadeIn>

          {/* Credibility */}
          <FadeIn show={revealed} delay={800}>
            <p className="mono mt-8 opacity-70">
              EpicVoicemails — live on iOS &amp; Android &nbsp;·&nbsp; React Native &nbsp;·&nbsp; Next.js
            </p>
          </FadeIn>

          <FadeIn show={revealed} delay={950}>
            <p className="mono mt-14 opacity-60">scroll ↓</p>
          </FadeIn>
        </div>

        {/* RIGHT — mockup column with 3D fly-in.
            Desktop: animated 0%→38% width beside the text.
            Mobile: full-width below the text, only once revealed. */}
        <div
          className="overflow-hidden flex items-center justify-center transition-[width,opacity,max-height] ease-out"
          style={{
            width: isMobile ? "100%" : revealed ? "38%" : "0%",
            maxHeight: isMobile ? (revealed ? "460px" : "0px") : "none",
            opacity: revealed ? 1 : 0,
            transitionDuration: "1300ms",
          }}
        >
          <div
            className={`relative shrink-0 ${revealed ? "mockup-enter" : ""}`}
            style={{
              width: isMobile ? 280 : 420,
              height: isMobile ? 400 : 480,
            }}
          >
            {revealed && <MorphingMockup />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- StaggerLetters — letter-by-letter rise animation ----- */
function StaggerLetters({ text, play }: { text: string; play: boolean }) {
  const words = text.split(" ");
  let idx = 0;
  return (
    <>
      {words.map((word, wi) => {
        const wordStart = idx;
        idx += word.length;
        const isLast = wi === words.length - 1;
        return (
          <span key={wi}>
            <span
              style={{ whiteSpace: "nowrap", display: "inline-block" }}
              aria-hidden={wi > 0 ? true : undefined}
            >
              {Array.from(word).map((ch, ci) => (
                <span
                  key={ci}
                  className={`letter ${play ? "in" : ""}`}
                  style={{ animationDelay: `${(wordStart + ci) * LETTER_STAGGER_MS}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
            {!isLast && (
              <span
                className={`letter ${play ? "in" : ""}`}
                style={{ animationDelay: `${idx++ * LETTER_STAGGER_MS}ms` }}
                aria-hidden
              >
                {" "}
              </span>
            )}
          </span>
        );
      })}
      {/* a11y — fallback non-staggered text for screen readers */}
      <span className="sr-only">{text}</span>
    </>
  );
}

/* ----- StatusPill ----- */
function StatusPill() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--rule)] bg-white/40 backdrop-blur-sm">
      <span className="relative inline-flex w-2 h-2">
        <span
          className="absolute inset-0 rounded-full opacity-75"
          style={{
            background: "#22C55E",
            animation: "pill-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <span className="relative inline-flex rounded-full w-2 h-2 bg-[#22C55E]" />
      </span>
      <span className="mono">Available for work</span>
      <style jsx>{`
        @keyframes pill-ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
