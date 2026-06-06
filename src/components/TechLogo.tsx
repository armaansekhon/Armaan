"use client";

import { techIcons } from "@/data/techIcons";

/**
 * Monochrome brand logo that colorizes on hover — keeps the editorial
 * pure-white aesthetic at rest, adds life on interaction.
 */
export function TechLogo({ name, size = 22 }: { name: string; size?: number }) {
  const icon = techIcons[name];
  if (!icon) return null;
  return (
    <span
      className="tech-logo group/logo relative inline-flex items-center justify-center"
      title={icon.title}
      data-cursor="hover"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={{ transition: "color 300ms var(--ease)" }}
        aria-label={icon.title}
        role="img"
      >
        <path d={icon.path} fill="currentColor" />
      </svg>
    </span>
  );
}
