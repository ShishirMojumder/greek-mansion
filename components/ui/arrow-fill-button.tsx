import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type OwnProps = {
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
};

export type ArrowFillButtonProps = OwnProps & Omit<ComponentPropsWithoutRef<"a">, keyof OwnProps>;

/** Branded link with a CSS-only fill animation; no client state or media-query effects. */
export default function ArrowFillButton({
  btnText = "Order Now",
  href = "#",
  className = "",
  bgColor = "#1E2A78",
  textColor = "#F8F5ED",
  fillBgColor = "#C9A227",
  fillTextColor = "#1E2A78",
  hoverFillBgColor = fillBgColor,
  hoverFillTextColor = fillTextColor,
  arrowColor = fillTextColor,
  hoverArrowColor = hoverFillTextColor,
  animationDuration = 450,
  fillOnHover = true,
  ...props
}: ArrowFillButtonProps) {
  const variables = {
    "--button-bg": bgColor,
    "--button-text": textColor,
    "--button-fill": fillBgColor,
    "--button-fill-hover": hoverFillBgColor,
    "--button-fill-text": fillTextColor,
    "--button-fill-text-hover": hoverFillTextColor,
    "--button-arrow": arrowColor,
    "--button-arrow-hover": hoverArrowColor,
    "--button-duration": `${animationDuration}ms`,
  } as CSSProperties;

  return <a href={href} {...props} style={variables} className={`arrow-fill-button focus-ring group ${fillOnHover ? "arrow-fill-button--animated" : ""} ${className}`}>
    <span className="relative z-10">{btnText}</span>
    <span className="arrow-fill-button__circle" aria-hidden="true"><ArrowRight size={17}/></span>
  </a>;
}
