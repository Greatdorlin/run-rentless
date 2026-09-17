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
  description: "Audit your business software costs. See your three-year spend, find what to retain or upgrade, and explore custom software with Run Rentless.",
  applicationName: "Run Rentless",
  keywords: ["software cost audit", "business software costs", "SaaS cost review", "custom business software", "software ownership assessment"],
  authors: [{ name: "Run Rentless" }],
  creator: "Run Rentless",
  openGraph: {
    title: "Are You Paying Too Much for Software? | Run Rentless",
    description: "Run a free Software Rent Audit using your actual bills. Get a clear RUN plan: Retain, Upgrade or explore New options.",
    type: "website",
    locale: "en_NG",
    siteName: "Run Rentless",
  },
  twitter: { card: "summary_large_image", title: "Run Rentless", description: "See what your software costs, what is worth keeping, and which workflows deserve a closer look." },
};

export const viewport: Viewport = { themeColor: "#031e19", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <FloatingWaitlist />
        <Footer />
      </body>
    </html>
  );
}
