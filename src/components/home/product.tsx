import Link from "next/link";
import { launchIncludes, leadsDeskCapabilities } from "@/content/site";
import { LeadsDeskPreview } from "./leads-desk-preview";

export function Product() {
  return (
    <section className="section product" id="products" aria-labelledby="product-title">
      <div className="shell">
        <div className="product__mast">
          <p className="eyebrow eyebrow--dark"><span /> Featured product 01</p>
          <div className="product__title-row">
            <h2 id="product-title">Leads Desk</h2>
            <p>Private lead management without per-user CRM pricing.</p>
          </div>
        </div>
        <div className="product__body">
          <LeadsDeskPreview compact />
          <div className="product__details">
            <p className="product__lead">Keep leads, next actions, ownership, and opportunity value in one private workspace your team can actually use.</p>
            <div className="capability-grid">
              {leadsDeskCapabilities.map((capability) => <span key={capability}>{capability}</span>)}
            </div>
            <div className="product__include">
              <h3>Your launch can include</h3>
              <ul>{launchIncludes.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <Link className="button button--dark" href="#waitlist">Join the Leads Desk Waitlist <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
