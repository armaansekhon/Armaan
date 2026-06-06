"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/** Access the shared Lenis instance (null on touch / reduced-motion / SSR). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Buttery smooth scroll via Lenis.
 * - Disabled entirely on reduced-motion (native scroll, fully accessible).
 * - Compatible with the Résumé scroll-fold (Lenis drives real scrollTop, so
 *   getBoundingClientRect stays accurate).
 * - The Hero pauses it during the intro via lenis.stop()/start().
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic — calm, editorial
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    setLenis(instance);

    function raf(time: number) {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
