import { WaitlistForm } from "./waitlist-form";

const benefits = ["Early access", "Founding-customer pricing", "Launch updates", "Private demos", "Priority deployment", "New-product testing"];

export function Waitlist() {
  return (
    <section className="section waitlist" id="waitlist" aria-labelledby="waitlist-title">
      <div className="shell waitlist__layout">
        <div className="waitlist__copy">
          <p className="eyebrow eyebrow--dark"><span /> Private launch list</p>
          <h2 id="waitlist-title">Be first to get Run Rentless.</h2>
          <p>Join the early group shaping simpler, private business software without compulsory per-user rent.</p>
          <ul>{benefits.map((benefit) => <li key={benefit}><span>✓</span>{benefit}</li>)}</ul>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
