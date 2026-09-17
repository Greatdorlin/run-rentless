import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Run Rentless handles information shared through this website." };

export default function PrivacyPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow"><span /> Website information</p>
      <h1>Privacy Policy</h1>
      <p className="legal-page__lede">You can see your audit results without giving us an email address. When you ask for a report, we receive the contact details and audit answers you choose to submit.</p>
      <section><h2>What we collect</h2><p>We collect your first and last names, email, company, team size, software names, costs, usage, workflow answers and any investment or engagement preferences you provide. Please do not include customer records, passwords or other sensitive information in free-text answers.</p></section>
      <section><h2>How we use it</h2><p>We use your submission to prepare and send your audit report and respond to enquiries. Sender processes and stores the submitted contact details, audit results and preferences on our behalf. Relevant service follow-up is optional and requires the separate permission offered on the form. Waitlist submissions are used for the products, demos and launch updates requested.</p></section>
      <section><h2>Your choices</h2><p>You can unsubscribe from marketing messages at any time using the link in an email, or contact Run Rentless to ask about access, correction, or deletion of your details.</p></section>
      <p><Link className="text-link" href="/#audit">Start the free audit →</Link></p>
    </article>
  );
}
