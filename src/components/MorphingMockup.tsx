"use client";

import { useEffect, useState } from "react";

type Stage = "mobile" | "website" | "ai";

const STAGES: Stage[] = ["mobile", "website", "ai"];
const HOLD_MS = 3000;

const STAGE_META: Record<Stage, { label: string; dot: string }> = {
  mobile:  { label: "Mobile",  dot: "#FF6B6B" },
  website: { label: "Website", dot: "#5BC0EB" },
  ai:      { label: "AI",      dot: "#C7B6FF" },
};

/**
 * Cycling hero visual: mobile mockup → website mockup → AI orb.
 * Smooth crossfade + scale between stages.
 * Pure CSS / SVG — no libraries.
 */
export function MorphingMockup() {
  const [idx, setIdx] = useState(0);
  const stage = STAGES[idx];

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % STAGES.length), HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Mobile  active={stage === "mobile"} />
      <Website active={stage === "website"} />
      <Orb     active={stage === "ai"} />

      {/* Stage label — each fades with its layer (perfect sync) */}
      <div className="absolute bottom-0 left-0 h-5">
        {STAGES.map((s) => (
          <div
            key={s}
            className="absolute inset-0 mono flex items-center gap-2 whitespace-nowrap"
            style={{
              opacity: s === stage ? 1 : 0,
              transform: `translateY(${s === stage ? 0 : 6}px)`,
              transition:
                "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: STAGE_META[s].dot,
                boxShadow: `0 0 8px ${STAGE_META[s].dot}`,
              }}
            />
            <span>{STAGE_META[s].label}</span>
          </div>
        ))}
      </div>

      {/* Stage indicator dots top-right */}
      <div className="absolute top-0 right-0 flex gap-2">
        {STAGES.map((s) => (
          <span
            key={s}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-700"
            style={{ background: s === stage ? "var(--text)" : "var(--rule)" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE — iPhone-style outline with screen gradient
   ============================================================ */
function Mobile({ active }: { active: boolean }) {
  return (
    <Layer active={active}>
      <div
        className="relative"
        style={{ height: "min(100%, 480px)", maxWidth: "100%", aspectRatio: "9/19.5" }}
      >
        <div
          className="absolute inset-0 rounded-[36px]"
          style={{
            background: "linear-gradient(150deg, #1c1c20 0%, #0a0a0c 100%)",
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1.5px rgba(0,0,0,0.85)",
          }}
        >
          <div
            className="absolute inset-[7px] rounded-[30px] overflow-hidden"
            style={{ background: "#0E0E14" }}
          >
            {/* ambient violet glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 60% at 50% 0%, rgba(199,182,255,0.22), transparent 60%)",
              }}
            />

            {/* App home UI */}
            <div className="absolute inset-0 flex flex-col px-3 pt-9 pb-2 text-white">
              {/* status bar */}
              <div className="flex items-center justify-between text-[8px] text-white/60 mb-3">
                <span>9:41</span>
                <span className="flex gap-1">
                  <span className="inline-block w-3 h-1.5 rounded-[2px] bg-white/40" />
                </span>
              </div>

              {/* greeting */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[8px] text-white/40">Good morning</p>
                  <p className="text-[12px] font-medium leading-tight">Armaan</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C7B6FF] to-[#8A6BFF]" />
              </div>

              {/* balance card */}
              <div
                className="rounded-2xl p-3 mb-3"
                style={{
                  background: "linear-gradient(135deg, #8A6BFF 0%, #5B4BD6 100%)",
                  boxShadow: "0 8px 20px -8px rgba(138,107,255,0.6)",
                }}
              >
                <p className="text-[7px] text-white/70">Total balance</p>
                <p className="text-[15px] font-semibold leading-tight mt-0.5">
                  $12,480
                </p>
                {/* sparkline */}
                <div className="mt-2 flex items-end gap-0.5 h-5">
                  {[40, 60, 35, 70, 55, 85, 65, 95].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-sm bg-white/40"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* filter pills */}
              <div className="flex gap-1.5 mb-3">
                <span className="text-[7px] px-2 py-1 rounded-full bg-white/90 text-black">All</span>
                <span className="text-[7px] px-2 py-1 rounded-full bg-white/10">Income</span>
                <span className="text-[7px] px-2 py-1 rounded-full bg-white/10">Spend</span>
              </div>

              {/* list rows */}
              <div className="flex flex-col gap-2">
                {[
                  { c: "#C7B6FF", v: "+$240" },
                  { c: "#FF6B6B", v: "-$58" },
                  { c: "#5BC0EB", v: "+$1,020" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full shrink-0"
                      style={{ background: row.c }}
                    />
                    <span className="flex-1 flex flex-col gap-1">
                      <span className="h-1.5 w-2/3 rounded-full bg-white/25" />
                      <span className="h-1 w-1/3 rounded-full bg-white/10" />
                    </span>
                    <span className="text-[8px] text-white/70">{row.v}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1" />

              {/* bottom tab bar */}
              <div className="flex items-center justify-around rounded-2xl bg-white/[0.06] py-2">
                {["#C7B6FF", "#FFFFFF40", "#FFFFFF40", "#FFFFFF40"].map((c, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-md"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {/* notch */}
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[64px] h-[20px] rounded-full bg-black z-10" />
          </div>
        </div>
        <div className="absolute -left-[2px] top-[70px] w-[3px] h-[20px] rounded-l bg-neutral-700" />
        <div className="absolute -left-[2px] top-[105px] w-[3px] h-[32px] rounded-l bg-neutral-700" />
        <div className="absolute -left-[2px] top-[148px] w-[3px] h-[32px] rounded-l bg-neutral-700" />
        <div className="absolute -right-[2px] top-[90px] w-[3px] h-[46px] rounded-r bg-neutral-700" />
      </div>
    </Layer>
  );
}

/* ============================================================
   WEBSITE — browser window (URL bar, tabs, traffic lights)
   ============================================================ */
function Website({ active }: { active: boolean }) {
  return (
    <Layer active={active}>
      <div
        className="relative"
        style={{ width: "min(380px, 100%)", maxHeight: "100%", aspectRatio: "16/10" }}
      >
        {/* Browser shell */}
        <div
          className="absolute inset-0 rounded-[10px] overflow-hidden"
          style={{
            background: "#1a1a1f",
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.85)",
          }}
        >
          {/* Chrome / titlebar */}
          <div className="relative h-[34px] flex items-center px-3 gap-2 bg-[#222226] border-b border-black/60">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            {/* URL pill */}
            <div className="flex-1 mx-3 h-5 rounded-md bg-[#0e0e12] flex items-center px-2">
              <span
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9,
                  letterSpacing: "0.04em",
                  color: "#8A8A85",
                }}
              >
                ◆ armaansekhon.com/work
              </span>
            </div>
            {/* Window controls */}
            <div className="flex gap-1">
              <span className="w-3 h-0.5 bg-white/30 rounded-full" />
              <span className="w-3 h-0.5 bg-white/30 rounded-full" />
              <span className="w-3 h-0.5 bg-white/30 rounded-full" />
            </div>
          </div>

          {/* Page body — analytics dashboard */}
          <div className="relative h-[calc(100%-34px)]" style={{ background: "#0E0E14" }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 60% at 80% 0%, rgba(138,107,255,0.18), transparent 60%)",
              }}
            />

            <div className="relative flex h-full text-white">
              {/* sidebar */}
              <div className="w-[46px] shrink-0 border-r border-white/10 flex flex-col items-center gap-3 py-3">
                <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#C7B6FF] to-[#8A6BFF]" />
                <span className="w-4 h-1 rounded-full bg-white/40 mt-1" />
                <span className="w-4 h-1 rounded-full bg-white/15" />
                <span className="w-4 h-1 rounded-full bg-white/15" />
                <span className="w-4 h-1 rounded-full bg-white/15" />
              </div>

              {/* main */}
              <div className="flex-1 p-3 flex flex-col gap-2.5 min-w-0">
                {/* header row */}
                <div className="flex items-center justify-between">
                  <div className="h-2 w-20 rounded-full bg-white/30" />
                  <div className="h-4 w-12 rounded-full bg-white/10" />
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Users", v: "8.2k", c: "#C7B6FF" },
                    { label: "Revenue", v: "$48k", c: "#5BC0EB" },
                    { label: "Churn", v: "1.4%", c: "#FF6B6B" },
                  ].map((k) => (
                    <div
                      key={k.label}
                      className="rounded-lg p-2 bg-white/[0.05] border border-white/10"
                    >
                      <span
                        className="block w-1.5 h-1.5 rounded-full mb-1.5"
                        style={{ background: k.c }}
                      />
                      <p className="text-[11px] font-semibold leading-none">{k.v}</p>
                      <p className="text-[7px] text-white/40 mt-1">{k.label}</p>
                    </div>
                  ))}
                </div>

                {/* chart */}
                <div className="rounded-lg p-2.5 bg-white/[0.05] border border-white/10 flex-1 min-h-0 flex items-end gap-1">
                  {[35, 55, 42, 68, 50, 78, 60, 88, 72, 95, 80, 64].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          "linear-gradient(180deg, #C7B6FF 0%, #8A6BFF 100%)",
                        opacity: 0.4 + (h / 100) * 0.6,
                      }}
                    />
                  ))}
                </div>

                {/* table rows */}
                <div className="flex flex-col gap-1.5">
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-white/15 shrink-0" />
                      <span className="h-1.5 flex-1 rounded-full bg-white/15" />
                      <span className="h-1.5 w-8 rounded-full bg-white/25" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layer>
  );
}

/* ============================================================
   AI — smooth iridescent sphere + emanating pulse rings
   No turbulence. Cleaner, more cinematic.
   ============================================================ */
function Orb({ active }: { active: boolean }) {
  return (
    <Layer active={active}>
      <div
        className="relative"
        style={{ width: "min(320px, 100%)", maxHeight: "100%", aspectRatio: "1/1" }}
      >
        {/* Emanating pulse rings — radar style */}
        <PulseRing delay={0}   />
        <PulseRing delay={1.0} />
        <PulseRing delay={2.0} />

        {/* Outer breathing halo */}
        <div className="absolute inset-0 rounded-full halo-anim" />

        {/* CORE SPHERE — multiple stacked layers for depth */}
        <div className="absolute inset-[40px] rounded-full overflow-hidden core-shadow">
          {/* Base radial gradient (the "skin") */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 28%, #FFE4F2 0%, #FFB6E0 22%, #C7B6FF 50%, #8A6BFF 78%, #5BC0EB 100%)",
            }}
          />

          {/* Slow-rotating iridescent conic — adds shifting reflections */}
          <div className="absolute inset-0 rounded-full conic-1" />

          {/* Counter-rotating soft conic — gives "thinking" motion */}
          <div className="absolute inset-0 rounded-full conic-2" />

          {/* Specular highlight (top-left "light source") */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 33% 24%, rgba(255,255,255,0.75), rgba(255,255,255,0.1) 22%, transparent 48%)",
              filter: "blur(2px)",
              mixBlendMode: "screen",
            }}
          />

          {/* Subtle bottom shadow for sphere volume */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 65% 80%, rgba(40,20,80,0.55), transparent 50%)",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* Thin outer ring */}
        <div className="absolute inset-[30px] rounded-full border border-white/20" />
      </div>

      <style jsx>{`
        .halo-anim {
          background: radial-gradient(
            closest-side,
            rgba(199, 182, 255, 0.55),
            rgba(199, 182, 255, 0.12) 55%,
            transparent 82%
          );
          filter: blur(28px);
          animation: orb-breathe 4s ease-in-out infinite;
        }
        .core-shadow {
          box-shadow:
            0 0 80px rgba(199, 182, 255, 0.45),
            0 30px 60px -10px rgba(80, 40, 180, 0.3);
        }
        .conic-1 {
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255, 200, 240, 0.45) 20%,
            transparent 45%,
            rgba(120, 180, 255, 0.45) 70%,
            transparent 100%
          );
          mix-blend-mode: overlay;
          animation: orb-spin 16s linear infinite;
        }
        .conic-2 {
          background: conic-gradient(
            from 220deg,
            transparent,
            rgba(255, 255, 255, 0.25) 25%,
            transparent 50%
          );
          mix-blend-mode: screen;
          filter: blur(3px);
          animation: orb-spin-rev 10s linear infinite;
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%      { transform: scale(1.08); opacity: 1;    }
        }
        @keyframes orb-spin     { to { transform: rotate(360deg);  } }
        @keyframes orb-spin-rev { to { transform: rotate(-360deg); } }
      `}</style>
    </Layer>
  );
}

function PulseRing({ delay }: { delay: number }) {
  return (
    <span
      className="absolute inset-[20px] rounded-full pulse-anim"
      style={{
        border: "1.5px solid rgba(199,182,255,0.6)",
        animationDelay: `${delay}s`,
      }}
    >
      <style jsx>{`
        .pulse-anim {
          animation: pulse-out 3s ease-out infinite;
        }
        @keyframes pulse-out {
          0%   { transform: scale(0.6); opacity: 0;   }
          20%  { opacity: 0.8; }
          100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

/* ============================================================
   Shared Layer — handles fade + scale per stage
   ============================================================ */
function Layer({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: active ? 1 : 0,
        transform: `scale(${active ? 1 : 0.82})`,
        transition:
          "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 1100ms cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}
