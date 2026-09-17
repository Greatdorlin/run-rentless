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
  title: { default: "Run Rentless | Keep It, Build Around It, or Own It", template: "%s | Run Rentless" },
  description: "Run Rentless helps companies decide what software is worth keeping, what may be worth owning, and what to do next.",
  applicationName: "Run Rentless",
  keywords: ["subscription-free business software", "CRM", "lead management", "no per-user pricing", "business tools"],
  authors: [{ name: "Run Rentless" }],
  creator: "Run Rentless",
  openGraph: {
    title: "Are You Paying Too Much for Software? | Run Rentless",
    description: "Run a free Software Rent Audit using your actual bills. See what to keep, what to look at more closely, and what to build around.",
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
