"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";

interface PhoneProps {
  project: Project;
  width?: number;
}

const CYCLE_MS = 3200; // time each screenshot shows before advancing

/**
 * Pure CSS iPhone outline with a screenshot "walkthrough".
 *
 * - screens[] advance with a slide-up + fade so it reads as moving through
 *   the app (not a flat dissolve).
 * - Hovering the phone dims the screen and slides up an "About" panel with a
 *   short summary + tech chips.
 * - comingSoon → branded gradient + "Coming {year}" teaser.
 * - The brand gradient base means a missing/broken image never looks broken.
 */
export function Phone({ project, width = 280 }: PhoneProps) {
  const { brandColor, name, tagline, summary, stack, year, screens, comingSoon } =
    project;

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [hovered, setHovered] = useState(false);

  // Reset when the project changes (hover swap in the list).
  useEffect(() => {
    setIdx(0);
    setFailed({});
  }, [project.slug]);

  // Advance cycle — paused while the About panel is open.
  const usable = (screens ?? []).filter((_, i) => !failed[i]);
  useEffect(() => {
    if (comingSoon || hovered || usable.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % (screens?.length ?? 1)),
      CYCLE_MS,
    );
    return () => clearInterval(id);
  }, [comingSoon, hovered, usable.length, screens?.length]);

  const hasScreens = !comingSoon && (screens?.length ?? 0) > 0;
  const allFailed = hasScreens && (screens ?? []).every((_, i) => failed[i]);
  const showSlideshow = hasScreens && !allFailed;
  const canHoverInfo = !comingSoon && !!summary;

  const gradient = `
    radial-gradient(120% 80% at 30% 20%, ${brandColor}88, transparent 60%),
    radial-gradient(80% 80% at 80% 90%, ${brandColor}44, transparent 70%),
    linear-gradient(180deg, ${brandColor}22 0%, #0a0a0c 70%)
  `;

  return (
    <div
      className="relative"
      style={{ width, aspectRatio: "9/19.5" }}
      onMouseEnter={() => canHoverInfo && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="hover"
    >
      <div
        className="absolute inset-0 rounded-[44px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25),0_0_0_1.5px_rgba(0,0,0,0.85)]"
        style={{ background: "linear-gradient(150deg, #1a1a1f 0%, #0a0a0c 100%)" }}
      >
        {/* inner bezel */}
        <div className="absolute inset-[8px] rounded-[36px] overflow-hidden bg-black">
          {/* Branded gradient — always the base layer / fallback */}
          <div className="absolute inset-0" style={{ background: gradient }} />

          {/* Name + tagline label — behind screenshots, shows when none load */}
          {!comingSoon && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center">
              <p className="serif-it text-white text-2xl tracking-tight">{name}</p>
              <p className="mono mt-1 text-white/40 line-clamp-2">{tagline}</p>
            </div>
          )}

          {/* Screenshot walkthrough — slide-up + fade between frames */}
          {showSlideshow &&
            (screens ?? []).map((src, i) => {
              if (failed[i]) return null;
              const active = i === idx;
              return (
                <img
                  key={src}
                  src={src}
                  alt={`${name} screen ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active
                      ? "translateY(0) scale(1)"
                      : "translateY(7%) scale(1.015)",
                    transition:
                      "opacity 650ms ease, transform 850ms cubic-bezier(0.22,1,0.36,1)",
                    filter: hovered ? "brightness(0.5) saturate(0.9)" : "none",
                    transitionProperty: "opacity, transform, filter",
                  }}
                  onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                />
              );
            })}

          {/* Coming-soon teaser */}
          {comingSoon && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="mono text-white/50 mb-3">In development</p>
              <p className="serif-it text-white text-3xl">{name}</p>
              <p className="mono mt-3 text-white/40">Coming {year}</p>
            </div>
          )}

          {/* Hover "About" panel — slides up, summary + tech chips */}
          {canHoverInfo && (
            <div
              className="absolute inset-0 flex flex-col justify-end p-5"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(8,8,12,0.55) 35%, rgba(8,8,12,0.9) 100%)",
                opacity: hovered ? 1 : 0,
                pointerEvents: "none",
                transition: "opacity 420ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div
                style={{
                  transform: hovered ? "translateY(0)" : "translateY(14px)",
                  transition: "transform 480ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <p
                  className="mono mb-2"
                  style={{ color: brandColor, letterSpacing: "0.18em" }}
                >
                  About
                </p>
                <p className="serif-it text-white text-2xl leading-none mb-3">
                  {name}
                </p>
                <p className="text-[12px] leading-relaxed text-white/75">
                  {summary}
                </p>
                {stack && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/20 px-2 py-0.5 text-[9px] text-white/70"
                        style={{ fontFamily: "ui-monospace, monospace" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute -left-[2px] top-[90px] w-[3px] h-[26px] rounded-l bg-neutral-700" />
      <div className="absolute -left-[2px] top-[140px] w-[3px] h-[40px] rounded-l bg-neutral-700" />
      <div className="absolute -left-[2px] top-[195px] w-[3px] h-[40px] rounded-l bg-neutral-700" />
      <div className="absolute -right-[2px] top-[120px] w-[3px] h-[60px] rounded-r bg-neutral-700" />
    </div>
  );
}
