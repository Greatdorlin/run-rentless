import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact", description: "Talk to Run Rentless about your software stack, workflow, or next build." };

export default function ContactPage() {
  return (
    <section className="contact-page shell">
      <div>
        <p className="eyebrow"><span /> Contact Run Rentless</p>
        <h1>Tell us what software is getting in your way.</h1>
        <p className="contact-page__intro">Already know the problem? Send us the workflow, cost, or limitation you want to change. Still figuring it out? Start with the free audit.</p>
      </div>
      <div className="contact-page__card">
        <p><strong>Start with the clearest route.</strong></p>
        <a className="button button--dark button--wide" href="mailto:info@runrentless.com?subject=Talk%20to%20Run%20Rentless">Email Run Rentless <span aria-hidden="true">↗</span></a>
        <Link className="contact-page__audit" href="/#audit">Or run the free Software Rent Audit</Link>
        <small>Share only what you are comfortable sending. We will use it to respond to your enquiry.</small>
      </div>
    </section>
  );
}
