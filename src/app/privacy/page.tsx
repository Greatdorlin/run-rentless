import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy", description: "How Run Rentless handles information shared through this website." };

export default function PrivacyPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow"><span /> Website information</p>
      <h1>Privacy, in plain language.</h1>
      <p className="legal-page__lede">When you join the waitlist, Run Rentless receives the details you submit so we can contact you about relevant products, private demos, and launch opportunities.</p>
      <section><h2>What we collect</h2><p>We collect your name, work email, company, team size, software interests, and any current software you choose to share. Please do not submit confidential customer records or sensitive operational data.</p></section>
      <section><h2>How we use it</h2><p>We use the information only for Run Rentless products, demos, launch opportunities, and related conversations you request. Sender securely processes waitlist submissions and communications on our behalf.</p></section>
      <section><h2>Your choices</h2><p>You can unsubscribe from marketing messages at any time using the link in an email, or contact Run Rentless to ask about access, correction, or deletion of your details.</p></section>
      <p><Link className="text-link" href="/#waitlist">Return to the waitlist →</Link></p>
    </article>
  );
}
