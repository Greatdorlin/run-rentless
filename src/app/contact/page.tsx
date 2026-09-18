import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact", description: "Talk to Run Rentless about your business tools and what you want to improve." };

export default function ContactPage() {
  return (
    <section className="contact-page shell">
      <div>
        <p className="eyebrow"><span /> Contact Run Rentless</p>
        <h1>What is getting in your team’s way?</h1>
        <p className="contact-page__intro">Tell us what takes too long, costs too much or does not work the way you need. Not sure where to start? Try the free tool review.</p>
      </div>
      <div className="contact-page__card">
        <p><strong>Tell us what you want to change.</strong></p>
        <a className="button button--dark button--wide" href="mailto:info@runrentless.com?subject=Talk%20to%20Run%20Rentless">Email Run Rentless <span aria-hidden="true">↗</span></a>
        <Link className="contact-page__audit" href="/#audit">Or run the free Software Rent Audit</Link>
        <small>Share only what you are comfortable sending. We will use it to respond to your enquiry.</small>
      </div>
    </section>
  );
}
