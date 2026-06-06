"use client";

import { useCallback, useRef } from "react";

/**
 * Web Audio keyboard tick.
 *
 * IMPORTANT: this hook is built around the browser autoplay constraint.
 * Audio will only play after a real user gesture (click/tap/keydown).
 * Call `prime()` from inside a user-gesture event handler exactly once;
 * after that, every `play()` will produce sound.
 */
export function useTypingSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const armedRef = useRef(false);

  const prime = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current!;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      // Silent click to "wake" the engine on iOS Safari
      const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      armedRef.current = true;
    } catch {
      /* ignore — audio just won't play */
    }
  }, []);

  const play = useCallback((volume = 1) => {
    const ctx = ctxRef.current;
    if (!ctx || !armedRef.current) return;
    try {
      const now = ctx.currentTime;

      // ~40ms noise burst → bandpass filter for "thock"
      const buffer = ctx.createBuffer(
        1,
        Math.floor(ctx.sampleRate * 0.04),
        ctx.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 900 + Math.random() * 700;
      filter.Q.value = 2.6;

      const gain = ctx.createGain();
      const peak = 0.14 * volume;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(now);
      source.stop(now + 0.06);
    } catch {
      /* ignore */
    }
  }, []);

  return { prime, play };
}
