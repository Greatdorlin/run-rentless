import { Difference } from "@/components/home/difference";
import { FAQ } from "@/components/home/faq";
import { FinalCTA } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { Ownership } from "@/components/home/ownership";
import { Process } from "@/components/home/process";
import { Product } from "@/components/home/product";
import { Waitlist } from "@/components/home/waitlist";

export default function Home() {
  return (
    <>
      <Hero />
      <Difference />
      <Process />
      <Product />
      <Ownership />
      <Waitlist />
      <FAQ />
      <FinalCTA />
    </>
  );
}
