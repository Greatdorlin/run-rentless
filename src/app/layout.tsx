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
  title: { default: "Free Software Rent Audit | Run Rentless", template: "%s | Run Rentless" },
  description: "Add the tools your company pays for and see what may be worth keeping, owning or extending—using your real numbers, not fabricated savings.",
  applicationName: "Run Rentless",
  keywords: ["subscription-free business software", "CRM", "lead management", "no per-user pricing", "business tools"],
  authors: [{ name: "Run Rentless" }],
  creator: "Run Rentless",
  openGraph: {
    title: "Free Software Rent Audit | Run Rentless",
    description: "See what you spend, what probably makes sense to keep, and which workflows may be worth owning instead.",
    type: "website",
    locale: "en_NG",
    siteName: "Run Rentless",
  },
  twitter: { card: "summary_large_image", title: "Run Rentless", description: "Subscription-free business software prepared and deployed for your team." },
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
