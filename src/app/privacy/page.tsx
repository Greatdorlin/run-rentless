import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy", description: "How Run Rentless handles information shared through this website." };

export default function PrivacyPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow"><span /> Website information</p>
      <h1>Privacy, in plain language.</h1>
      <p className="legal-page__lede">This early website does not connect its waitlist form to a remote customer database. Form details are saved only in your browser so the experience can be reviewed honestly before a secure submission service is connected.</p>
      <section><h2>What this site stores</h2><p>If you complete the waitlist form, the values are stored locally on the device and browser you use. Run Rentless does not receive them from this version of the form.</p></section>
      <section><h2>How future submissions will be used</h2><p>Once secure submission is enabled, information provided through the waitlist will be used for Run Rentless product updates, private demos, launch opportunities, and related conversations you request. This page will be updated before that collection begins.</p></section>
      <section><h2>Your choices</h2><p>You can clear locally stored form details through your browser storage controls. Do not submit confidential customer records or sensitive operational data through the public website.</p></section>
      <p><Link className="text-link" href="/#waitlist">Return to the waitlist →</Link></p>
    </article>
  );
}
