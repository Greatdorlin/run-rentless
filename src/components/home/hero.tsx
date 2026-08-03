import Link from "next/link";
import { trustPoints } from "@/content/site";
import { LeadsDeskPreview } from "./leads-desk-preview";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="shell hero__layout">
        <div className="hero__copy reveal">
          <p className="eyebrow"><span /> Subscription-free business software</p>
          <h1 id="hero-title">Stop renting the software your business depends on.</h1>
          <p className="hero__intro">
            Run Rentless gives your organisation private business software, prepared and launched for you—without compulsory per-user rent or a shared customer database.
          </p>
          <div className="hero__actions">
            <Link className="button" href="#waitlist">Join the Waitlist <span aria-hidden="true">↗</span></Link>
            <Link className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></Link>
          </div>
          <p className="hero__note">Private deployment <i /> 24 months hosting included <i /> Continued use of the installed version</p>
        </div>

        <div className="hero-visual reveal reveal--delay">
          <div className="orbit orbit--one" aria-hidden="true" />
          <div className="orbit orbit--two" aria-hidden="true" />
          <LeadsDeskPreview />
          <div className="visual-tag visual-tag--top"><span>24</span> months<br />hosting included</div>
          <div className="visual-tag visual-tag--bottom"><span>✓</span> Setup handled</div>
        </div>
      </div>

      <div className="shell trust-strip" aria-label="Run Rentless benefits">
        {trustPoints.map((point, index) => (
          <div key={point}><span>0{index + 1}</span>{point}</div>
        ))}
      </div>
    </section>
  );
}
