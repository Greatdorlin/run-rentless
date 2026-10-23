import type { Metadata } from "next";
import Link from "next/link";
import { SoftwareRentAudit } from "@/components/audit/software-rent-audit";
import { HomeStory } from "@/components/site/home-story";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <><aside className="home-challenge-invite" aria-label="MoreDone AI Challenge"><div className="shell"><span>Join our AI Challenge cohort.</span><Link href="/moredone">See all about it <span aria-hidden="true">↗</span></Link></div></aside><SoftwareRentAudit><HomeStory /></SoftwareRentAudit></>
  );
}
