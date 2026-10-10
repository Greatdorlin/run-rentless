import type { Metadata } from "next";
import { OfferCheckout } from "@/components/webinar-pay/offer-checkout";
import "./webinar-pay.css";
import "./webinar-pay-checkout.css";

export const metadata: Metadata = {
  title: "AI Execution Lab | Build a Better Way to Run Your Business",
  description: "Bring one costly subscription or repeated task. Build the first version of an AI workflow for your own business in class. Choose one, two or five seats.",
  alternates: { canonical: "/webinar-pay" },
};

export default function WebinarPayPage() {
  return <div className="offer-page">
    <section className="offer-hero"><div className="shell offer-hero__grid"><div>
      <span className="offer-kicker">RUN RENTLESS · AI EXECUTION LAB</span>
      <h1>Stop collecting AI ideas.<br /><em>Build one that helps your business.</em></h1>
      <p>Bring a tool you keep paying for or a task your team repeats every week. We will help you make a working first version of a better way to do it.</p>
      <a className="offer-hero__cta" href="#checkout">Choose your seats <span aria-hidden="true">↗</span></a>
      <small>Bring your laptop. No technical background required.</small>
    </div><div className="offer-hero__visual" aria-hidden="true"><span>YOUR BUSINESS TODAY</span><div><b>Another bill.</b><b>Another manual step.</b></div><span className="offer-hero__divider">↓</span><strong>Build the part<br />you actually need.</strong></div></div></section>
    <section className="offer-what"><div className="shell"><span className="offer-kicker">WHAT HAPPENS IN CLASS</span><h2>Start with your real work.<br />Leave with something you can use.</h2><div className="offer-what__grid">
      <div><span>01</span><h3>Pick the right job</h3><p>Look at your software bill and the work still taking your team’s time. Choose one process worth improving.</p></div>
      <div><span>02</span><h3>Build a first version</h3><p>Give AI your examples and standards. Put a simple workflow around the result, with a person checking the important steps.</p></div>
      <div><span>03</span><h3>Know what comes next</h3><p>Compare the cost of your current tool with building and running your own version. Know what to keep and what to improve.</p></div>
    </div><p className="offer-what__aside">You will keep the software-cost worksheet, AI assistant starter, workflow template and AI video character sheet we use in class.</p></div></section>
    <section className="offer-price-section"><div className="shell"><OfferCheckout /></div></section>
    <section className="offer-last"><div className="shell"><h2>You already have a task in mind.</h2><p>Bring it to class. You do not need another list of tools. You need a useful first version built around your business.</p><a href="#checkout">Choose your seats <span aria-hidden="true">↗</span></a></div></section>
  </div>;
}
