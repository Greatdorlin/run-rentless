import type { Metadata } from "next";
import { WebinarAnchor } from "@/components/webinar/webinar-anchor";
import { siAirtable, siAsana, siCalendly, siHubspot, siMailchimp, siZapier } from "simple-icons";
import { WebinarCountdown } from "@/components/webinar/countdown";
import { RegistrationForm } from "@/components/webinar/registration-form";
import "./webinar.css";

export const metadata: Metadata = {
  title: "Making AI Make Business Sense | Live Webinar",
  description: "Join Navrademy and Run Rentless on 10th October 2026 at 6PM GMT+1 for a free live webinar on using AI to cut manual work, reduce wasted software spend and build custom business solutions with no technical background needed.",
  alternates: { canonical: "/webinar" },
  openGraph: {
    title: "Making AI Make Business Sense | Live Webinar",
    description: "A free practical webinar on using AI to cut manual work, reduce wasted software spend and build custom solutions for your business. No technical background needed. Saturday, 10th October 2026 at 6PM GMT+1.",
    url: "https://www.runrentless.com/webinar",
    type: "website",
  },
};

const lessons = [
  { title: "See what is costing you time and money", copy: "Look at the tools you pay for and the manual work your team still does. You’ll see what is worth fixing first." },
  { title: "Find work AI can help with", copy: "Spot repeated admin, copied data and missed follow-ups that AI can help reduce." },
  { title: "Know what to keep, connect or build", copy: "Learn when to keep a tool, connect the tools you already use or create a custom solution for your business." },
  { title: "Start without a technical background", copy: "You do not need to know how to code. We’ll show you a simple way to think through your first practical AI solution." },
];

const familiarTools = [
  { name: "HubSpot", icon: siHubspot, job: "Sales" },
  { name: "Mailchimp", icon: siMailchimp, job: "Email" },
  { name: "Asana", icon: siAsana, job: "Projects" },
  { name: "Airtable", icon: siAirtable, job: "Data" },
  { name: "Zapier", icon: siZapier, job: "Automation" },
  { name: "Calendly", icon: siCalendly, job: "Bookings" },
];

const examples = [
  ["Customer details in three spreadsheets", "One place your team can trust"],
  ["Leads copied and followed up manually", "A follow-up process that keeps moving without constant chasing"],
  ["Finance updates passed between tools", "Less copying and fewer missed updates"],
  ["Several tools used for one client job", "A simpler way to manage the whole job"],
];

const audiences = [
  ["Business owners & founders", "See where AI can save time, reduce wasted software spend and solve real business problems."],
  ["Sales, marketing & operations teams", "Bring the repetitive work your team wants to reduce and see where AI can help."],
  ["Agencies & consultants", "See how AI can help you turn repeated client work into custom solutions that fit how you work."],
  ["Non-technical professionals", "You do not need to code. If you understand the business problem, you can follow this webinar."],
];

export default function WebinarPage() {
  return (
    <div className="webinar-page">
      <section className="webinar-hero" aria-labelledby="webinar-title">
        <div className="shell webinar-hero__grid">
          <div className="webinar-hero__copy">
            <p className="webinar-kicker"><span /> Navrademy × Run Rentless present <em>Live webinar</em></p>
            <h1 id="webinar-title">Making AI make <span>business sense.</span></h1>
            <p className="webinar-hero__lead">Join this free live webinar and learn how to use AI to cut manual work, reduce wasted software spend and build custom solutions around your business, no technical background required.</p>
            <div className="webinar-hero__event"><strong>Saturday, 10th October 2026</strong><span>6PM GMT+1 · Live online</span></div>
            <div className="webinar-hero__actions"><WebinarAnchor className="webinar-cta" href="#webinar-form">Register free <span aria-hidden="true">↗</span></WebinarAnchor><WebinarAnchor className="webinar-hero__secondary" href="#what-you-will-learn">See what you’ll learn <span aria-hidden="true">↓</span></WebinarAnchor></div>
          </div>
          <div className="webinar-hero__visual">
            <div className="webinar-hero__visual-top"><span>LIVE ONLINE</span><span>FREE WEBINAR</span></div>
            <div className="webinar-hero__visual-main"><p>We go<br /><span>live in.</span></p><WebinarCountdown /></div>
            <div className="webinar-hero__visual-bottom"><span>10TH OCTOBER 2026</span><span>6PM GMT+1</span></div>
          </div>
        </div>
      </section>

      <section className="webinar-problem" aria-labelledby="webinar-problem-title">
        <div className="shell webinar-problem__grid">
          <div><p className="webinar-section-label">Why this webinar matters</p><h2 id="webinar-problem-title">More tools should not mean<br /><span>more manual work.</span></h2></div>
          <div className="webinar-problem__story"><p>You may already pay for one tool for sales, another for email and another to keep projects moving.</p><p>Yet your team may still copy information, chase updates and fix tasks manually.</p><strong>Join us and learn how to spot the work and software costs worth fixing first.</strong></div>
        </div>
      </section>

      <section className="webinar-tools" aria-labelledby="webinar-tools-title">
        <div className="shell webinar-tools__grid">
          <div className="webinar-tools__copy"><p className="webinar-section-label">Where the money goes</p><h2 id="webinar-tools-title">You may be paying for tools and still paying in staff time.</h2><p>One tool for sales. Another for email. Another for bookings. Yet your team may still copy information, chase updates and do important work manually.</p><div className="webinar-tools__question"><strong>AI can help you build around the way your business works.</strong><span>We’ll show you how to spot what is worth fixing and when a custom solution makes sense. You do not need to know how to code.</span></div><WebinarAnchor className="webinar-tools__link" href="#webinar-form">Register free <span aria-hidden="true">↗</span></WebinarAnchor></div>
          <div className="webinar-tools__list" aria-label="Examples of business software tools">{familiarTools.map(({ name, icon, job }) => <div className="webinar-tools__item" key={name}><span className="webinar-tools__icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={icon.path} fill={`#${icon.hex}`} /></svg></span><span className="webinar-tools__name">{name}<small>{job}</small></span></div>)}</div>
        </div>
        <p className="shell webinar-tools__note">Brand marks are shown only as familiar examples. Run Rentless is not affiliated with these companies.</p>
      </section>

      <section className="webinar-promise" aria-labelledby="webinar-promise-title">
        <div className="shell"><p className="webinar-section-label">What you gain</p><h2 id="webinar-promise-title">Keep what works.<br /><span>Fix what costs you time.</span></h2><p className="webinar-promise__intro">You do not need to become a developer. We’ll show you how to look at a real business problem, see where AI can help and understand when a custom solution may be worth building.</p><div className="webinar-promise__outcomes"><span>Spot wasted software spend</span><span>Reduce manual work</span><span>See where AI can help</span><span>Know what to do next</span></div><WebinarAnchor className="webinar-cta webinar-cta--dark" href="#webinar-form">Register free <span aria-hidden="true">↗</span></WebinarAnchor></div>
      </section>

      <section id="what-you-will-learn" className="webinar-learning" aria-labelledby="webinar-learning-title">
        <div className="shell"><div className="webinar-learning__heading"><p className="webinar-section-label">What you’ll learn</p><h2 id="webinar-learning-title">See what to fix and where AI can help.</h2><p>We’ll use plain business language. No coding knowledge or technical background is needed.</p></div><div className="webinar-learning__list">{lessons.map((item) => <article key={item.title}><span className="webinar-learning__marker" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div><span aria-hidden="true">↗</span></article>)}</div><div className="webinar-learning__test"><strong>No technical background needed.</strong><p>Start with a real business problem. We’ll show you how to work out what AI can help with, what a custom solution could look like and what to check before you build.</p></div></div>
      </section>

      <section className="webinar-examples" aria-labelledby="webinar-examples-title">
        <div className="shell webinar-examples__grid"><div><p className="webinar-section-label">Picture it at work</p><h2 id="webinar-examples-title">What could get easier?</h2><p>See the kind of problems to look for in your own business, then bring one to the webinar.</p></div><div className="webinar-examples__list">{examples.map(([before, after]) => <div key={before}><span>{before}</span><strong aria-hidden="true">→</strong><span>{after}</span></div>)}</div></div>
      </section>

      <section className="webinar-audience" aria-labelledby="webinar-audience-title"><div className="shell"><p className="webinar-section-label">Who this is for</p><h2 id="webinar-audience-title">If you want practical ways to use AI in your business, this webinar is for you. No technical background needed.</h2><div className="webinar-audience__list">{audiences.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="webinar-register" id="register" aria-labelledby="webinar-register-title"><div className="shell webinar-register__grid"><div className="webinar-register__copy"><p className="webinar-section-label">Register free</p><h2 id="webinar-register-title">Bring one business problem.<br /><span>Leave knowing where AI can help.</span></h2><p>No coding or technical background needed. Bring one tool or process that costs too much time or money, and we’ll show you how to think through a better solution.</p><div className="webinar-register__date"><strong>Making AI Make Business Sense</strong><span>Saturday, 10th October 2026</span><span>6PM GMT+1 · Live online</span></div></div><div id="webinar-form"><RegistrationForm /></div></div></section>
    </div>
  );
}
