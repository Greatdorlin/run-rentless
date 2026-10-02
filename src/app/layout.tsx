import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { Footer } from "@/components/site/footer";
import { FloatingWaitlist } from "@/components/site/floating-waitlist";
import { Header } from "@/components/site/header";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.runrentless.com"),
  title: { default: "Free Software Cost Audit & Custom Software | Run Rentless", template: "%s | Run Rentless" },
  description: "Run Rentless helps businesses review tool subscriptions, connect their apps and build custom software. Start with a free cost audit, then assess what is worth changing.",
  applicationName: "Run Rentless",
  keywords: ["software cost audit", "business software costs", "SaaS cost review", "custom business software", "software ownership assessment"],
  authors: [{ name: "Run Rentless" }],
  creator: "Run Rentless",
  openGraph: {
    title: "Are Your Tools Costing More Than They Should? | Run Rentless",
    description: "Run a free Software Rent Audit using your actual bills. Get a clear RUN plan: Retain, Upgrade or explore New options.",
    type: "website",
    locale: "en_NG",
    siteName: "Run Rentless",
  },
  twitter: { card: "summary_large_image", title: "Run Rentless", description: "Review the tools you pay for, cut wasted subscriptions and build what is missing. Start with a free audit." },
};

export const viewport: Viewport = { themeColor: "#031e19", colorScheme: "dark" };

const businessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://www.runrentless.com/#organization", name: "Run Rentless", url: "https://www.runrentless.com", logo: "https://www.runrentless.com/brand/run-rentless-logo-reverse.png", email: "info@runrentless.com", description: "Run Rentless helps businesses review paid tools, improve how they work together and build custom business software when it makes sense." },
    { "@type": "WebSite", "@id": "https://www.runrentless.com/#website", name: "Run Rentless", url: "https://www.runrentless.com", publisher: { "@id": "https://www.runrentless.com/#organization" } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <FloatingWaitlist />
        <Footer />
      </body>
    </html>
  );
}
