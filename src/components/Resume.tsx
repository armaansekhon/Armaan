"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  resumeFolds,
  resumeHeader,
  resumeTech,
  type ResumeFold,
} from "@/data/resume";
import { site } from "@/data/site";
import { MagneticButton } from "./MagneticButton";
import { TechLogo } from "./TechLogo";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function Resume() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let frame = 0;
    function update() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const next = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      setProgress(next);
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMobile]);

  const foldProgress = resumeFolds.map((_, index) => {
    if (isMobile) return 1;
    if (index === 0) return 1;
    const start = index * 0.13;
    return clamp((progress - start) / 0.26, 0, 1);
  });

  return (
    <section
      ref={sectionRef}
      className="resume-section relative px-6 sm:px-8 md:px-16"
      aria-label="Resume"
      data-mobile={isMobile ? "true" : "false"}
    >
      <div className="resume-sticky flex min-h-[100dvh] items-center py-20 md:sticky md:top-0">
        <div className="grid w-full max-w-[1500px] grid-cols-12 gap-8 mx-auto">
          {/* LEFT — minimal sticky label */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
            <p className="mono">Résumé</p>
            <h2
              className="serif-it"
              style={{
                fontSize: "clamp(40px, 5vw, 76px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              Built to ship.
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-[240px]">
              The one-page version — résumé, on paper.
            </p>
            <MagneticButton
              href={site.resumeUrl}
              download
              className="inline-flex items-center justify-center self-start rounded-full border border-[var(--text)] px-6 py-3 text-sm font-medium transition-colors duration-300 hover:bg-[var(--text)] hover:text-[var(--bg)]"
            >
              Download PDF&nbsp;&nbsp;↓
            </MagneticButton>
          </div>

          {/* RIGHT — folding paper cards */}
          <div className="col-span-12 md:col-span-9">
            <div className="resume-folds">
              {resumeFolds.map((fold, index) => {
                const p = foldProgress[index];
                const rotate = index === 0 ? 0 : (1 - p) * -82;
                const lift = (1 - p) * (index === 0 ? 0 : -16);
                return (
                  <article
                    key={fold.title}
                    className="resume-panel doc"
                    style={
                      {
                        "--fold-rotate": `${rotate}deg`,
                        "--fold-opacity": 0.3 + p * 0.7,
                        "--fold-lift": `${lift}px`,
                      } as CSSProperties
                    }
                  >
                    {index === 0 && <Letterhead />}
                    <div className="paper-h">
                      <span>{fold.title}</span>
                      <span className="rule" />
                    </div>
                    <FoldBody fold={fold} />
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- Letterhead (top of first paper) ----- */
function Letterhead() {
  return (
    <header className="text-center border-b border-[rgba(27,26,22,0.18)] pb-6 mb-8">
      <h3 style={{ fontSize: "clamp(26px, 3.6vw, 38px)", fontWeight: 700, letterSpacing: "0.01em" }}>
        {resumeHeader.name}
      </h3>
      <p className="mt-1" style={{ fontSize: 15, fontStyle: "italic", color: "#5f5949" }}>
        {resumeHeader.title}
      </p>
      <p
        className="mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1"
        style={{ fontSize: 12.5, color: "#3a382f" }}
      >
        {resumeHeader.contacts.map((c, i) => (
          <span key={c} className="inline-flex items-center gap-2">
            {i > 0 && <span style={{ color: "#b7b09a" }}>·</span>}
            {c}
          </span>
        ))}
      </p>
    </header>
  );
}

/* ----- Per-kind fold body (paper styled) ----- */
function FoldBody({ fold }: { fold: ResumeFold }) {
  if (fold.kind === "summary") {
    return <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{fold.summary}</p>;
  }

  if (fold.kind === "experience") {
    return (
      <div className="relative" style={{ paddingLeft: 22 }}>
        <span
          aria-hidden
          className="absolute"
          style={{ left: 4, top: 6, bottom: 6, width: 1, background: "rgba(27,26,22,0.2)" }}
        />
        <div className="flex flex-col gap-7">
          {fold.experience.map((job, i) => (
            <div key={i} className="relative">
              <span
                aria-hidden
                className="absolute rounded-full"
                style={{
                  left: -22,
                  top: 6,
                  width: 9,
                  height: 9,
                  background: i === 0 ? "#b4452f" : "#1b1a16",
                  boxShadow: "0 0 0 3px #fbf8ef",
                }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h4 style={{ fontSize: 16, fontWeight: 700 }}>
                  {job.role}
                  <span style={{ fontWeight: 400, color: "#5f5949" }}> — {job.company}</span>
                </h4>
                <span style={{ fontSize: 12, fontStyle: "italic", color: "#6b6552" }}>
                  {job.dates}
                  {job.location ? ` · ${job.location}` : ""}
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-1.5">
                {job.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    className="flex gap-2"
                    style={{ fontSize: 13.5, lineHeight: 1.55, color: "#3a382f" }}
                  >
                    <span style={{ color: "#b4452f" }}>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (fold.kind === "projects") {
    return (
      <div className="flex flex-col gap-6">
        {fold.projects.map((pr, i) => (
          <div key={i}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h4 style={{ fontSize: 15.5, fontWeight: 700 }}>{pr.name}</h4>
              <span style={{ fontSize: 12, fontStyle: "italic", color: "#6b6552" }}>
                {pr.dates}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#6b6552", marginTop: 2 }}>
              {pr.stack.join(" · ")}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {pr.bullets.map((b, bi) => (
                <li
                  key={bi}
                  className="flex gap-2"
                  style={{ fontSize: 13.5, lineHeight: 1.55, color: "#3a382f" }}
                >
                  <span style={{ color: "#b4452f" }}>—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (fold.kind === "education") {
    return (
      <div className="space-y-4">
        {fold.education.map((ed) => (
          <div key={ed.school} className="flex flex-wrap items-baseline justify-between gap-x-4">
            <div>
              <h4 style={{ fontSize: 15.5, fontWeight: 700 }}>{ed.school}</h4>
              <p style={{ fontSize: 13.5, color: "#5f5949" }}>
                {ed.credential}
                {ed.detail ? ` · ${ed.detail}` : ""}
              </p>
            </div>
            <span style={{ fontSize: 12, fontStyle: "italic", color: "#6b6552" }}>
              {ed.dates}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // skills — logo row + grouped
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {resumeTech.map((t) => (
          <TechLogo key={t} name={t} size={20} />
        ))}
      </div>
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {fold.skills.map((g) => (
          <div key={g.group}>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6b6552",
                marginBottom: 4,
              }}
            >
              {g.group}
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#3a382f" }}>
              {g.items.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
