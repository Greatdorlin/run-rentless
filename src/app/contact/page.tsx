import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact", description: "Start a Run Rentless launch conversation." };

export default function ContactPage() {
  return (
    <section className="contact-page shell">
      <div>
        <p className="eyebrow"><span /> Start simply</p>
        <h1>Tell us what your team should stop wrestling with.</h1>
      </div>
      <div className="contact-page__card">
        <p>Run Rentless is preparing its private launch. The best next step is to save your early-access details and choose the product area you care about.</p>
        <Link className="button button--dark" href="/#waitlist">Go to the waitlist <span aria-hidden="true">↗</span></Link>
        <small>The current form is a transparent client-side preview and does not yet transmit entries.</small>
      </div>
    </section>
  );
}
