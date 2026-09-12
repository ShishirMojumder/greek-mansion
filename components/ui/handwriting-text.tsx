import type { CSSProperties } from "react";

type Props = {
  text: string;
  duration?: number;
  delay?: number;
  height?: string;
  className?: string;
};

/** Decorative local-font text revealed with CSS; no runtime font parsing required. */
export function HandwritingText({ text, duration = 1.5, delay = 0.05, height = "1.15em", className = "" }: Props) {
  const variables = {
    "--handwriting-duration": `${duration}s`,
    "--handwriting-delay": `${delay}s`,
    fontSize: height,
  } as CSSProperties;

  return <span className={`handwriting-text ${className}`} style={variables}>{text}</span>;
}
