import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Website Terms", description: "Run Rentless website terms and commercial clarifications." };

export default function TermsPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow"><span /> Website terms</p>
      <h1>Clear expectations from the start.</h1>
      <p className="legal-page__lede">This website introduces the Run Rentless model. Product scope, pricing, implementation, hosting eligibility, support, third-party services, and migration terms are confirmed in a written proposal before purchase.</p>
      <section><h2>Installed software</h2><p>“Continued use” means the agreed installed version is not disabled solely because optional support is inactive or included hosting ends. It does not promise permanent compatibility, unlimited infrastructure, every future update, or freedom from third-party costs.</p></section>
      <section><h2>Hosting and support</h2><p>Twenty-four months of hosting applies to eligible packages and begins on the agreed date. Afterward, hosting may be renewed or the deployment may be moved to compatible infrastructure. Optional support, migrations, recovery work, improvements, and third-party services may carry separate costs.</p></section>
      <section><h2>Waitlist</h2><p>Joining a future waitlist will not guarantee availability, pricing, delivery timing, or acceptance of a project. The current preview form stores details only in your browser and does not send them to Run Rentless.</p></section>
      <p><Link className="text-link" href="/contact">Ask a question →</Link></p>
    </article>
  );
}
