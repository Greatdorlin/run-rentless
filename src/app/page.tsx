import type { Metadata } from "next";
import { SoftwareRentAudit } from "@/components/audit/software-rent-audit";
import { HomeStory } from "@/components/site/home-story";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <SoftwareRentAudit><HomeStory /></SoftwareRentAudit>
  );
}
