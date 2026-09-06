import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Brand display face from the storefront signage. Latin caps only (no Greek
// letters, middot or em dash) — reserve it for short accent words via `.accent`.
const greekFreak = localFont({
  src: "./fonts/greek-freak.ttf",
  variable: "--font-greek",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greekmansion.ca"),
  title: {
    default: "Greek Mansion | Greek Restaurant in Scarborough",
    template: "%s | Greek Mansion",
  },
  description:
    "Souvlaki, gyros, Greek plates, family meals and catering in Scarborough, Toronto.",
  keywords: [
    "Greek restaurant Scarborough",
    "Greek food Scarborough",
    "Greek catering Toronto",
    "Gyro Scarborough",
    "Souvlaki Toronto",
  ],
  openGraph: {
    title: "Greek Mansion Restaurant",
    description: "A taste of Greece in Scarborough.",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greek Mansion Restaurant",
    description: "Souvlaki, gyros, Greek plates and catering in Scarborough.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${greekFreak.variable}`}>
      <body>{children}</body>
    </html>
  );
}
