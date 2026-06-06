"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { Phone } from "./Phone";

/**
 * Work — Seyit-style two-column layout.
 * Left: massive serif italic project list (Hasque-influenced size, Seyit-influenced flow).
 * Right: sticky iPhone preview that swaps to the hovered project.
 */
export function Work() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = projects[activeIdx];

  return (
    <section className="relative min-h-[100dvh] px-6 sm:px-8 md:px-16 py-24" aria-label="Work">
      <p className="mono mb-12 md:mb-16">Selected work — 2024 / 2025</p>

      <div className="grid grid-cols-12 gap-8 max-w-[1500px] w-full mx-auto">
        {/* LEFT — project list */}
        <ul className="col-span-12 md:col-span-7 lg:col-span-7">
          {projects.map((p, i) => (
            <li
              key={p.slug}
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
              tabIndex={0}
              className="group border-b border-[var(--rule)]"
            >
              <div
                data-cursor="hover"
                className={`block py-7 md:py-8 transition-colors duration-500 ease-out ${
                  p.comingSoon ? "opacity-60" : "hover:text-[var(--accent)]"
                }`}
              >
                <span className="flex items-baseline justify-between gap-6">
                  <span className="flex items-baseline gap-4 md:gap-6 flex-1 min-w-0">
                    <span className="mono opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                      {p.number}
                    </span>
                    <span
                      className="serif-it transition-transform duration-500 ease-out group-hover:translate-x-3"
                      style={{
                        fontSize: "clamp(34px, 12vw, 130px)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.name}
                    </span>
                  </span>
                  <span className="mono opacity-60 group-hover:opacity-100 hidden md:inline transition-opacity duration-500 whitespace-nowrap">
                    {p.comingSoon ? `Coming ${p.year}` : `${p.category} · ${p.year}`}
                  </span>
                </span>

                {/* Mobile-only: brand strip + meta (the Phone preview is desktop-only) */}
                <span className="mt-4 flex items-center gap-3 md:hidden">
                  <span
                    className="h-2 w-10 shrink-0 rounded-full"
                    style={{ background: p.brandColor }}
                    aria-hidden
                  />
                  <span className="mono">
                    {p.comingSoon ? `Coming ${p.year}` : `${p.category} · ${p.year}`}
                  </span>
                </span>
                <span className="mt-2 block text-sm text-[var(--muted)] md:hidden">
                  {p.tagline}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* RIGHT — iPhone preview, vertically centered in the viewport while
            scrolling and nudged right for optical balance. */}
        <div className="hidden md:block col-span-5 lg:col-span-5">
          <div className="sticky top-[10vh] translate-x-4 lg:translate-x-8 flex flex-col items-center">
            <Phone project={active} width={236} />
            <p className="serif-it mt-5 text-2xl">{active.name}</p>
            <p className="mono mt-3 text-[10px] opacity-40">Hover for details</p>
          </div>
        </div>
      </div>
    </section>
  );
}
