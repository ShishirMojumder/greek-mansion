import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Button({ href, children, variant = "solid", className = "", target }: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "light";
  className?: string;
  target?: "_blank";
}) {
  const styles = variant === "solid"
    ? "border-navy bg-navy text-white hover:bg-ink"
    : variant === "light"
      ? "border-white bg-white text-navy hover:bg-marble"
      : "border-navy bg-transparent text-navy hover:bg-navy hover:text-white";

  return <Link
    href={href}
    target={target}
    rel={target === "_blank" ? "noreferrer" : undefined}
    className={`focus-ring group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border px-6 py-4 text-[11px] font-semibold tracking-[.2em] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.025] hover:shadow-lg active:translate-y-0 active:scale-[.98] ${styles} ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <span className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-current/10 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45 group-hover:scale-110">
      <ArrowUpRight size={14}/>
    </span>
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/20 opacity-0 blur-sm transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"/>
  </Link>;
}
