import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms for using the Run Rentless website, free audit and webinar registration.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow"><span /> Last updated 3 October 2026</p>
      <h1>Terms of Use</h1>
      <p className="legal-page__lede">These terms explain what to expect when you use the Run Rentless website, free audit and event registration. If you have a question, contact <a href="mailto:info@runrentless.com">info@runrentless.com</a>.</p>

      <section><h2>Using this website</h2><p>You may browse the site and use its forms for genuine business enquiries. Please give accurate contact information, do not submit someone else’s details without permission, and do not use the site to send harmful code, spam or unlawful material. We may limit misuse to protect the service.</p></section>
      <section><h2>The free audit</h2><p>The audit works from the tools, costs and answers you provide. A three-year figure shows what today’s entered costs would total over 36 months if they stayed the same. It is not a savings forecast. Recommendations are a starting point for discussion, not a guarantee that replacing or building a tool will save money. Before making a decision, check your actual bills, data, integrations, migration and ongoing running costs.</p></section>
      <section><h2>Events and messages</h2><p>When you register for a webinar, we use your details to manage your place and send event information. Dates, speakers or joining details may change; if they do, we will aim to tell registered attendees. Optional marketing and audit follow-up are explained at the point where you choose them and in our <Link href="/privacy">Privacy Policy</Link>.</p></section>
      <section><h2>Waitlist</h2><p>Joining a waitlist lets us contact you about the products, demos or launch opportunities described there. It does not guarantee availability, a particular price, delivery date or acceptance of a project.</p></section>
      <section><h2>Products and paid work</h2><p>Website descriptions are general information, not a binding offer or a project quote. Any paid assessment, training, software build, hosting, support or migration will have its own written scope, price and terms before you commit. Third-party subscriptions, infrastructure and other costs may still apply. We do not promise a particular cost reduction, revenue increase or business outcome.</p></section>
      <section><h2>Hosting and installed tools</h2><p>Where an offer includes 24 months of hosting, eligibility and the start date will be set out in its written terms. Hosting can be renewed or moved to compatible infrastructure afterward. “Continued use” of an installed tool means its agreed version is not disabled solely because optional support ends; it does not promise permanent compatibility, every future update or freedom from third-party costs.</p></section>
      <section><h2>Content and other sites</h2><p>Run Rentless owns or has permission to use the website content and branding. You may use your own audit results for your business, but please do not copy our site or branding for another service. Links to other sites are provided for convenience; those services have their own terms and privacy practices.</p></section>
      <section><h2>Availability and responsibility</h2><p>We work to keep the website available and accurate, but it may be interrupted or contain mistakes. Check important facts before relying on them. Nothing here removes rights or responsibilities that cannot be excluded under applicable law. We may update these terms; the latest version and date will appear on this page.</p></section>
      <p><Link className="text-link" href="/contact">Ask a question →</Link></p>
    </article>
  );
}
