import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import FloatingMenu from "@/components/FloatingMenu";
import ReviewFab from "@/components/ReviewFab";

const schema = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "LocalBusiness"],
  name: "Greek Mansion Restaurant",
  logo: "https://greekmansion.ca/images/greek-mansion-logo.png",
  image: "https://greekmansion.ca/images/greek-mansion-logo.png",
  telephone: "+1-416-292-3333",
  servesCuisine: ["Greek", "Mediterranean"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "5651 Steeles Ave E #10",
    addressLocality: "Scarborough",
    addressRegion: "ON",
    postalCode: "M1V 5P6",
    addressCountry: "CA",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "11:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "21:00" },
  ],
  url: "https://greekmansion.ca",
  priceRange: "$$",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingMenu />
      <ReviewFab />
      <MobileBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
