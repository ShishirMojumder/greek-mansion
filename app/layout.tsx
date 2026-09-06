import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greekmansion.ca"),
  title: {
    default: "Greek Mansion | Authentic Greek Restaurant in Scarborough",
    template: "%s | Greek Mansion",
  },
  description:
    "Authentic Greek cuisine, souvlaki, gyros, family meals and catering in Scarborough, Toronto.",
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
    description: "Authentic Greek cuisine, souvlaki, gyros and catering in Scarborough.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
