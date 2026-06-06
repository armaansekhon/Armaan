"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Global custom cursor: an instant dot + a lerped trailing ring.
 * - Renders nothing on touch devices (pointer: coarse).
 * - Respects prefers-reduced-motion (drops the lerp; ring follows instantly).
 * - Grows + accent-tints the ring over interactive elements (delegated).
 *
 * Mounted once in the root layout. All visual styling lives in globals.css
 * under @media (pointer: fine).
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only fine pointers (mouse/trackpad). Bail on touch.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let raf = 0;
    let visible = false;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dotRef.current?.style.setProperty("opacity", "1");
        ringRef.current?.style.setProperty("opacity", "1");
      }
      // Dot is always instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (reduced && ringRef.current) {
        ringRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
    }

    function loop() {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    }

    function onOver(e: PointerEvent) {
      const t = e.target as Element | null;
      if (t?.closest?.("a, button, input, textarea, [data-cursor='hover']")) {
        ringRef.current?.setAttribute("data-active", "true");
      }
    }
    function onOut(e: PointerEvent) {
      const t = e.target as Element | null;
      if (t?.closest?.("a, button, input, textarea, [data-cursor='hover']")) {
        ringRef.current?.removeAttribute("data-active");
      }
    }
    function onLeave() {
      visible = false;
      dotRef.current?.style.setProperty("opacity", "0");
      ringRef.current?.style.setProperty("opacity", "0");
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden />
    </>
  );
}
