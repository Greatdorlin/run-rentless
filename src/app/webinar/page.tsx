import type { Metadata } from "next";
import Link from "next/link";
import { siAirtable, siAsana, siCalendly, siHubspot, siMailchimp, siZapier } from "simple-icons";
import { WebinarCountdown } from "@/components/webinar/countdown";
import { RegistrationForm } from "@/components/webinar/registration-form";
import "./webinar.css";

export const metadata: Metadata = {
  title: "Making AI Make Business Sense | Live Webinar",
  description: "Join Navrademy and Run Rentless on 10 October 2026 at 6PM GMT+1. Learn where AI can cut repetitive work, simplify operations and reduce unnecessary software costs.",
  alternates: { canonical: "/webinar" },
  openGraph: {
    title: "Making AI Make Business Sense | Live Webinar",
    description: "A practical webinar about building AI tools around the way your business works. Saturday, 10 October 2026 at 6PM GMT+1.",
    url: "https://www.runrentless.com/webinar",
    type: "website",
  },
};

const lessons = [
  { title: "See what you pay for", copy: "List the tools, the bills and the work each one handles. Start with your real costs, not public prices." },
  { title: "Find where work gets stuck", copy: "Look for information copied by hand, missed follow-ups and several tools doing parts of one job." },
  { title: "Choose the right fix", copy: "Keep a tool that earns its place. Connect tools that should talk. Build only when that makes more sense." },
  { title: "Build it safely", copy: "Know what to check before your team relies on something new: your data, access, testing, backups and running costs." },
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
  ["Leads copied and chased by hand", "A follow-up process that runs on time"],
  ["Finance updates passed between tools", "A smoother process around your accounts"],
  ["Several tools to deliver one client job", "A simpler way to manage the work"],
];

const audiences = [
  ["Business owners & founders", "Find out whether another subscription is really your best option."],
  ["Sales, marketing & operations teams", "Bring the slow, repetitive work your team wants to fix."],
  ["Agencies & consultants", "Learn to build useful systems for the work you and your clients do."],
  ["People learning AI", "Use AI to solve a real business problem, not just make another demo."],
];

export default function WebinarPage() {
  return (
    <div className="webinar-page">
      <section className="webinar-hero" aria-labelledby="webinar-title">
        <div className="shell webinar-hero__grid">
          <div className="webinar-hero__copy">
            <p className="webinar-kicker"><span /> Navrademy × Run Rentless present <em>Live webinar</em></p>
            <h1 id="webinar-title">Making AI make <span>business sense.</span></h1>
            <p className="webinar-hero__lead">See how AI can help you build tools that fit your business, cut repeated work and spend less where it makes sense.</p>
            <div className="webinar-hero__event"><strong>Saturday, 10 October 2026</strong><span>6PM GMT+1 · Live online</span></div>
            <div className="webinar-hero__actions"><Link className="webinar-cta" href="#webinar-form">Get a spot <span aria-hidden="true">↗</span></Link><Link className="webinar-hero__secondary" href="#what-you-will-learn">See what you’ll learn <span aria-hidden="true">↓</span></Link></div>
          </div>
          <div className="webinar-hero__visual">
            <div className="webinar-hero__visual-top"><span>LIVE ONLINE</span><span>FREE WEBINAR</span></div>
            <div className="webinar-hero__visual-main"><p>We go<br /><span>live in.</span></p><WebinarCountdown /></div>
            <div className="webinar-hero__visual-bottom"><span>10 OCTOBER 2026</span><span>6PM GMT+1</span></div>
          </div>
        </div>
      </section>

      <section className="webinar-problem" aria-labelledby="webinar-problem-title">
        <div className="shell webinar-problem__grid">
          <div><p className="webinar-section-label">The real question</p><h2 id="webinar-problem-title">More tools.<br /><span>Less work?</span></h2></div>
          <div className="webinar-problem__story"><p>You pay for one tool for sales, another for email and another to keep projects moving.</p><p>Yet someone still copies information between them, chases an update or fixes a task the tools were meant to handle.</p><strong>Before you buy one more tool, look at the work itself.</strong></div>
        </div>
      </section>

      <section className="webinar-tools" aria-labelledby="webinar-tools-title">
        <div className="shell webinar-tools__grid">
          <div className="webinar-tools__copy"><p className="webinar-section-label">Familiar tools. Real bills.</p><h2 id="webinar-tools-title">The tools add up. So does the work between them.</h2><p>One for sales. One for email. One for bookings. One to pass data between them. Each can help, but your team may still be doing the hard part by hand.</p><div className="webinar-tools__question"><strong>What if you could build the parts your business needs?</strong><span>Could that cut your software bill by 40% or more? Perhaps. We’ll show you how to check the full cost before you decide.</span></div><Link className="webinar-tools__link" href="#webinar-form">Get a spot <span aria-hidden="true">↗</span></Link></div>
          <div className="webinar-tools__list" aria-label="Examples of business software tools">{familiarTools.map(({ name, icon, job }) => <div className="webinar-tools__item" key={name}><span className="webinar-tools__icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={icon.path} fill={`#${icon.hex}`} /></svg></span><span className="webinar-tools__name">{name}<small>{job}</small></span></div>)}</div>
        </div>
        <p className="shell webinar-tools__note">Brand marks are shown only as familiar examples. Run Rentless is not affiliated with these companies.</p>
      </section>

      <section className="webinar-promise" aria-labelledby="webinar-promise-title">
        <div className="shell"><p className="webinar-section-label">A better choice</p><h2 id="webinar-promise-title">Keep what helps.<br /><span>Build what is missing.</span></h2><p className="webinar-promise__intro">You do not need to replace every tool. Learn when to keep one, when to make two work together and when a tool built for your business could be worth the effort.</p><div className="webinar-promise__outcomes"><span>Less wasted spend</span><span>Fewer repeated tasks</span><span>Better use of your data</span><span>More control</span></div><Link className="webinar-cta webinar-cta--dark" href="#webinar-form">Get a spot <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section id="what-you-will-learn" className="webinar-learning" aria-labelledby="webinar-learning-title">
        <div className="shell"><div className="webinar-learning__heading"><p className="webinar-section-label">What you’ll learn</p><h2 id="webinar-learning-title">Start with the work. Then choose the tool.</h2><p>A clear way to decide what is worth changing in your business.</p></div><div className="webinar-learning__list">{lessons.map((item) => <article key={item.title}><span className="webinar-learning__marker" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div><span aria-hidden="true">↗</span></article>)}</div><div className="webinar-learning__test"><strong>One rule before you build.</strong><p>Count the full cost of building, moving your data and keeping a new tool running. A smaller subscription bill alone is not proof you will save money.</p></div></div>
      </section>

      <section className="webinar-examples" aria-labelledby="webinar-examples-title">
        <div className="shell webinar-examples__grid"><div><p className="webinar-section-label">Picture it at work</p><h2 id="webinar-examples-title">What could be easier?</h2><p>Keep the parts that work. Fix the handoffs that slow people down.</p></div><div className="webinar-examples__list">{examples.map(([before, after]) => <div key={before}><span>{before}</span><strong aria-hidden="true">→</strong><span>{after}</span></div>)}</div></div>
      </section>

      <section className="webinar-audience" aria-labelledby="webinar-audience-title"><div className="shell"><p className="webinar-section-label">Who this is for</p><h2 id="webinar-audience-title">If your team pays for tools and still does too much by hand, come along.</h2><div className="webinar-audience__list">{audiences.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="webinar-register" id="register" aria-labelledby="webinar-register-title"><div className="shell webinar-register__grid"><div className="webinar-register__copy"><p className="webinar-section-label">Your next step</p><h2 id="webinar-register-title">Bring one costly tool.<br /><span>Leave with a better question.</span></h2><p>What should you keep, connect or build? Join us and find out what to check before you spend more.</p><div className="webinar-register__date"><strong>Making AI Make Business Sense</strong><span>Saturday, 10 October 2026</span><span>6PM GMT+1 · Live online</span></div></div><div id="webinar-form"><RegistrationForm /></div></div></section>
    </div>
  );
}
