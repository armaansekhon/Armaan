"use client";

import { useEffect, useRef } from "react";

/**
 * Magnetic-pull hook. Attach the returned ref to an element; while the pointer
 * hovers it, the element gently translates toward the pointer. Springs back on
 * leave via the CSS `.magnetic` transition.
 *
 * No-op on touch devices and when prefers-reduced-motion is set.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength = 0.3,
  max = 14,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      const clamp = (v: number) => Math.max(-max, Math.min(max, v));
      el!.style.transform = `translate(${clamp(dx)}px, ${clamp(dy)}px)`;
    }
    function reset() {
      el!.style.transform = "";
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [strength, max]);

  return ref;
}
