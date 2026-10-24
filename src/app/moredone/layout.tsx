import { Manrope } from "next/font/google";

const moreDoneFont = Manrope({ subsets: ["latin"], variable: "--font-moredone", display: "swap" });

export default function MoreDoneLayout({ children }: { children: React.ReactNode }) {
  return <div className={moreDoneFont.variable}>{children}</div>;
}
