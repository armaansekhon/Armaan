"use client";

/**
 * Shared fade-in-up wrapper. Reveals children when `show` flips true,
 * with an optional stagger delay. Extracted from Hero so Contact and the
 * mobile Résumé can reuse the exact same motion.
 */
export function FadeIn({
  show,
  delay = 0,
  children,
  className,
}: {
  show: boolean;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: `translateY(${show ? 0 : 12}px)`,
        transition:
          "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
