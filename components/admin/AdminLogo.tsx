import Image from "next/image";

/** The wordmark PNGs are square with generous transparent padding, so they are
 *  cropped to the wordmark's own 3.2:1 box (same trick as the public BrandLogo). */
export function AdminLogo({ className = "w-40", white = false }: { className?: string; white?: boolean }) {
  return (
    <span className={`relative block aspect-[3.2/1] overflow-hidden ${className}`}>
      <Image
        src={white ? "/images/greek-mansion-logo-white.png" : "/images/greek-mansion-logo.png"}
        alt="Greek Mansion"
        fill
        priority
        sizes="260px"
        className="object-cover object-[50%_54%]"
      />
    </span>
  );
}
