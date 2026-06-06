"use client";

import { useMagnetic } from "@/hooks/useMagnetic";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  max?: number;
};

type AnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as?: "a" };
type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" };

/**
 * A link or button with a magnetic pointer-pull. Tags itself for the custom
 * cursor's hover state. Defaults to an anchor.
 */
export function MagneticButton(props: AnchorProps | ButtonProps) {
  const { children, className = "", strength, max, as = "a", ...rest } = props;
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(strength, max);

  // Base only carries the magnetic transform hook + cursor tag.
  // Display/layout is fully owned by the caller's className to avoid conflicts.
  const shared = {
    ref,
    className: `magnetic ${className}`,
    "data-cursor": "hover",
  } as const;

  if (as === "button") {
    return (
      <button {...shared} {...(rest as ButtonProps)}>
        {children}
      </button>
    );
  }
  return (
    <a {...shared} {...(rest as AnchorProps)}>
      {children}
    </a>
  );
}
