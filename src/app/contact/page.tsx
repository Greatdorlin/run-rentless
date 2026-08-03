import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact", description: "Start a Run Rentless launch conversation." };

export default function ContactPage() {
  return (
    <section className="contact-page shell">
      <div>
        <p className="eyebrow"><span /> Start simply</p>
        <h1>Choose what your team needs help with.</h1>
      </div>
      <div className="contact-page__card">
        <p>Join the early-access list and choose the type of ready-made business software your team needs.</p>
        <Link className="button button--dark" href="/#waitlist">Go to the waitlist <span aria-hidden="true">↗</span></Link>
        <small>We will only contact you about relevant Run Rentless products, demos, and launch opportunities.</small>
      </div>
    </section>
  );
}
