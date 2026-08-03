import { WaitlistForm } from "./waitlist-form";

const benefits = ["Early access", "Founding-customer pricing", "Launch updates", "Product demos", "Priority deployment", "New-product testing"];

export function Waitlist() {
  return (
    <section className="section waitlist" id="waitlist" aria-labelledby="waitlist-title">
      <div className="shell waitlist__layout">
        <div className="waitlist__copy">
          <p className="eyebrow eyebrow--dark"><span /> Early access list</p>
          <h2 id="waitlist-title">Be first to get Run Rentless.</h2>
          <p>Join the early group getting clearer, subscription-free business software prepared for their teams.</p>
          <ul>{benefits.map((benefit) => <li key={benefit}><span>✓</span>{benefit}</li>)}</ul>
          <div className="waitlist__reassurance">
            <strong>Useful updates only.</strong>
            <p>We will use your details only for Run Rentless products, demos, and launch opportunities—not a noisy mailing list.</p>
          </div>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
