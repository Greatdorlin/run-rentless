import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Run Rentless collects, uses and protects information shared through this website.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow"><span /> Last updated 3 October 2026</p>
      <h1>Privacy Policy</h1>
      <p className="legal-page__lede">Run Rentless uses the information you share to deliver what you ask for, such as an audit report or webinar place. You can see your audit results before giving us your contact details. Questions about your information? Email <a href="mailto:info@runrentless.com">info@runrentless.com</a>.</p>

      <section><h2>Who is responsible</h2><p>Run Rentless, Kigali, Rwanda, is responsible for the personal information collected through this website. You can reach us at <a href="mailto:info@runrentless.com">info@runrentless.com</a>.</p></section>
      <section><h2>What we collect</h2><p>When you request an audit report, we collect your name, work email, company, role, business sector, team size if provided, and the answers you enter about your tools, costs and work. We also record whether you asked for follow-up or other updates. When you register for a webinar, we collect your name, email, phone number, role, sector and, if applicable, company name. If you contact us or join a waitlist, we collect the details you send. Our hosting service may also receive basic technical information, such as an IP address and browser details, to operate and protect the site. Please do not put passwords, customer records or sensitive personal details in free-text answers.</p></section>
      <section><h2>Why we use it</h2><p>We use your details to provide the report, registration, reply or other service you request. If you separately choose audit follow-up, we may contact you about your results and relevant help. If you separately choose marketing updates, we may send them until you opt out. We also use limited technical information to maintain site security and investigate problems. The audit gives automated guidance based on your answers. It is a starting point, not a final decision about your business or a decision with legal effect.</p></section>
      <section><h2>Who receives it</h2><p>We use website hosting and email delivery services to run the site, keep submitted details and send messages. People working with Run Rentless may review submissions when responding to you. If you choose to open a WhatsApp group or another external link, that service handles information under its own privacy rules. We do not sell your personal information.</p></section>
      <section><h2>Where information is handled</h2><p>Some service providers may handle information outside Rwanda. If you need details about a particular transfer or provider, contact us.</p></section>
      <section><h2>How long we keep it</h2><p>We keep information for as long as needed to provide the requested service, manage relevant follow-up, meet legal obligations and resolve disputes. We review information we no longer need and delete or anonymise it where appropriate. You can ask us to delete your information sooner, subject to any legal reason to keep it.</p></section>
      <section><h2>Your choices and rights</h2><p>You can ask to see, correct or delete your information, object to or restrict certain uses, or withdraw a permission you gave. Use the unsubscribe link in a marketing email or write to <a href="mailto:info@runrentless.com">info@runrentless.com</a>. Withdrawing marketing permission does not stop messages needed to deliver something you requested. We may need to confirm your identity before acting on a request. You may also raise a concern with the relevant data protection authority.</p></section>
      <section><h2>Security and changes</h2><p>We take reasonable steps to protect submitted information and limit access to people who need it. No website or email service can promise absolute security. If this policy changes, we will update the date on this page. Important changes may also be brought to your attention.</p></section>
      <p><Link className="text-link" href="/#audit">Start the free audit →</Link></p>
    </article>
  );
}
