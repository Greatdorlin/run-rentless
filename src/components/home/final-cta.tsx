import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="shell final-cta__inner">
        <p className="eyebrow"><span /> A better relationship with software</p>
        <h2 id="final-cta-title">Your business software should become an asset.</h2>
        <p className="final-cta__line">We deploy it. <i>You use it.</i> You keep it.</p>
        <div><Link className="button" href="#waitlist">Join the Waitlist <span aria-hidden="true">↗</span></Link><Link className="text-link" href="#products">Explore Leads Desk <span aria-hidden="true">↓</span></Link></div>
      </div>
    </section>
  );
}
