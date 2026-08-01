import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://run-rentless.vercel.app"),
  title: { default: "Run Rentless | Private Business Software", template: "%s | Run Rentless" },
  description: "Private business software prepared for your organisation—done-for-you setup, predictable costs, and no compulsory per-user software rent.",
  applicationName: "Run Rentless",
  keywords: ["private business software", "CRM", "lead management", "no per-user pricing", "business tools"],
  authors: [{ name: "Run Rentless" }],
  creator: "Run Rentless",
  openGraph: {
    title: "Stop Renting the Software Your Business Depends On",
    description: "Private business software prepared and launched for your organisation.",
    type: "website",
    locale: "en_NG",
    siteName: "Run Rentless",
  },
  twitter: { card: "summary_large_image", title: "Run Rentless", description: "Private business software prepared for your organisation." },
};

export const viewport: Viewport = { themeColor: "#031e19", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
