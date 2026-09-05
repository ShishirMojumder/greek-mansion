// Built using Hyperiux Vault: https://vault.hyperiux.com
// Adapted for Tailwind v3 + Greek Mansion branding (navy / gold / marble).

"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";

const DEFAULT_HREF = "#";
const COMPACT_LAYOUT_BREAKPOINT = 1280;
const ANIMATION_DURATION_MS = 450;

export interface ArrowFillButtonOwnProps {
  btnText?: string;
  href?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  fillBgColor?: string;
  fillTextColor?: string;
  hoverFillBgColor?: string;
  hoverFillTextColor?: string;
  arrowColor?: string;
  hoverArrowColor?: string;
  animationDuration?: number;
  fillOnHover?: boolean;
}

export type ArrowFillButtonProps = ArrowFillButtonOwnProps & Omit<ComponentPropsWithoutRef<"a">, keyof ArrowFillButtonOwnProps>;

function ArrowFillButton({
  btnText = "Order Now",
  href = DEFAULT_HREF,
  className = "",

  bgColor = "#1E2A78",
  textColor = "#F8F5ED",

  fillBgColor = "#C9A227",
  fillTextColor = "#1E2A78",

  hoverFillBgColor = "#C9A227",
  hoverFillTextColor = "#1E2A78",

  arrowColor,
  hoverArrowColor,

  ...props
}: ArrowFillButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const releaseTimeoutRef = useRef<number | null>(null);

  const usesUtilityBackground =
    className.includes("bg-") ||
    className.includes("from-") ||
    className.includes("via-") ||
    className.includes("to-");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${COMPACT_LAYOUT_BREAKPOINT - 1}px)`);

    const syncCompactLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      const matches = "matches" in event ? event.matches : ((event as MediaQueryListEvent).currentTarget as MediaQueryList).matches;
      setIsCompactLayout(matches);

      if (!matches) {
        setIsPressed(false);
      }
    };

    syncCompactLayout(mediaQuery);
    mediaQuery.addEventListener("change", syncCompactLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncCompactLayout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  const clearPressedState = () => {
    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
    }

    releaseTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = null;
    }, ANIMATION_DURATION_MS);
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerDown?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }

    setIsPressed(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerUp?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerCancel?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  return (
    <a
      href={href}
      {...props}
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`group relative inline-flex h-[50px] w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--btn-bg)] pl-6 pr-[calc(var(--icon-circle)+var(--icon-right)+18px)] whitespace-nowrap font-semibold uppercase leading-none tracking-[.14em] text-[12px] [text-rendering:geometricPrecision] [--icon-circle:38px] [--icon-right:6px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-sm:h-[44px] max-sm:pl-5 max-sm:pr-[calc(var(--icon-circle)+var(--icon-right)+15px)] max-sm:text-[11px] max-sm:[--icon-circle:32px] ${
        usesUtilityBackground ? "" : "bg-[var(--btn-bg)]"
      } text-[var(--btn-text)] ${className}`}
      style={
        {
          "--btn-bg": bgColor,
          "--btn-text": textColor,
          "--btn-fill-bg": fillBgColor,
          "--btn-fill-text": fillTextColor,
          "--btn-fill-bg-hover": hoverFillBgColor,
          "--btn-fill-text-hover": hoverFillTextColor,
          "--btn-arrow": arrowColor || fillTextColor,
          "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
          visibility: isReady ? "visible" : "hidden",
        } as CSSProperties & Record<string, string | number>
      }
    >
      <span className="relative z-[1] pb-px">{btnText}</span>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute z-[2] rounded-full bg-[var(--btn-fill-bg)] inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))] ${
          isReady
            ? "transition-all duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:bg-[var(--btn-fill-bg-hover)] group-hover:inset-0 group-data-[pressed=true]:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]:inset-0"
            : ""
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[2] flex items-center pl-6 pr-[calc(var(--icon-circle)+var(--icon-right)+18px)] text-[var(--btn-fill-text)] [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))] max-sm:pl-5 max-sm:pr-[calc(var(--icon-circle)+var(--icon-right)+15px)] ${
          isReady
            ? "transition-all duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:text-[var(--btn-fill-text-hover)] group-hover:[clip-path:inset(0_0_0_0)] group-data-[pressed=true]:text-[var(--btn-fill-text-hover)] group-data-[pressed=true]:[clip-path:inset(0_0_0_0)]"
            : ""
        }`}
      >
        <span className="relative z-[1] pb-px whitespace-nowrap">{btnText}</span>
      </div>

      <span
        className={`pointer-events-none absolute right-[var(--icon-right)] top-1/2 z-[3] inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-[var(--btn-fill-bg)] text-[var(--btn-arrow)] ${
          isReady
            ? "transition-colors duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:bg-[var(--btn-fill-bg-hover)] group-hover:text-[var(--btn-arrow-hover)] group-data-[pressed=true]:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]:text-[var(--btn-arrow-hover)]"
            : ""
        }`}
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          maskImage: "radial-gradient(white, black)",
        }}
        aria-hidden="true"
      >
        <ArrowRight
          className={`absolute left-1/2 top-1/2 size-[17px] max-sm:size-[15px] translate-x-[-170%] -translate-y-1/2 origin-center scale-0 text-current ${
            isReady
              ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100 group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-100"
              : ""
          }`}
          strokeWidth={1.8}
        />

        <ArrowRight
          className={`absolute left-1/2 top-1/2 size-[17px] max-sm:size-[15px] -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
            isReady
              ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:translate-x-[70%] group-hover:-translate-y-1/2 group-hover:scale-0 group-data-[pressed=true]:translate-x-[70%] group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-0"
              : ""
          }`}
          strokeWidth={1.8}
        />
      </span>
    </a>
  );
}

export default ArrowFillButton;
