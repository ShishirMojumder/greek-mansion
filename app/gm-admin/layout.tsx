import type { Metadata } from "next";

// Admin is per-request and cookie-gated: never prerender or cache any /gm-admin route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Greek Mansion Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function GmAdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-marble text-ink antialiased">
      {children}
    </div>
  );
}
