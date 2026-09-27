import type { Metadata } from "next";
import Link from "next/link";
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
  { number: "01", title: "Find the cost behind the work", copy: "Spot the subscriptions, repeated tasks and disconnected processes that deserve a closer look." },
  { number: "02", title: "Know what to keep, connect or build", copy: "Some tools earn their place. Others work better together. Learn when a focused AI-built system may be worth exploring." },
  { number: "03", title: "Build around the result", copy: "Start with what your team needs to get done, then shape the system around that workflow. No technical background required to follow along." },
  { number: "04", title: "Make AI useful in real operations", copy: "Move past prompts and demos. See how to plan, build and check a tool before your team relies on it." },
];

const examples = [
  ["Scattered spreadsheets", "One connected internal system"],
  ["Leads moved by hand", "A clearer capture and follow-up flow"],
  ["Disconnected finance steps", "Smoother work around the accounting tool you keep"],
  ["Too many agency tools", "A leaner way to deliver client work"],
];

const audiences = [
  ["Business owners & founders", "See what AI could change before adding another monthly bill."],
  ["Sales, marketing & operations teams", "Make scattered information and manual follow-up easier to manage."],
  ["Agencies & consultants", "Explore practical systems that improve delivery and margins."],
  ["People learning AI", "Go from knowing tools to solving problems businesses actually have."],
];

export default function WebinarPage() {
  return (
    <div className="webinar-page">
      <section className="webinar-hero" aria-labelledby="webinar-title">
        <div className="shell webinar-hero__grid">
          <div className="webinar-hero__copy">
            <p className="webinar-kicker"><span /> Navrademy × Run Rentless present <em>Live webinar</em></p>
            <h1 id="webinar-title">Making AI make <span>business sense.</span></h1>
            <p className="webinar-hero__lead">Learn to build AI systems around the way your business works. Spend less on tools you do not need and make the work easier for your team.</p>
            <div className="webinar-hero__event"><strong>Saturday, 10 October 2026</strong><span>6PM GMT+1 · Live online</span></div>
            <div className="webinar-hero__actions"><Link className="webinar-cta" href="#register">Get a spot for your team <span aria-hidden="true">↗</span></Link><Link className="webinar-hero__secondary" href="#what-you-will-learn">See what you’ll learn <span aria-hidden="true">↓</span></Link></div>
          </div>
          <div className="webinar-hero__visual">
            <div className="webinar-hero__visual-top"><span>AI / BUSINESS</span><span>10.10.26</span></div>
            <p>More tools<br /><span>≠</span><br />less work.</p>
            <div className="webinar-hero__visual-bottom"><span>Make the work make sense.</span><span>01 / 03</span></div>
          </div>
          <div className="webinar-hero__timer"><WebinarCountdown /><span className="webinar-hero__timer-note">Free to attend. Bring someone from your team.</span></div>
        </div>
      </section>

      <section className="webinar-problem" aria-labelledby="webinar-problem-title">
        <div className="shell webinar-problem__grid">
          <div><p className="webinar-section-label">The business question</p><h2 id="webinar-problem-title">Your business pays for tools.<br /><span>Is work getting easier?</span></h2></div>
          <div className="webinar-problem__story"><p>One tool for sales. Another for marketing. More spreadsheets trying to connect them.</p><p>Your team still moves information by hand, chases updates and works around systems that do not fit.</p><strong>Another subscription is not always the answer.</strong></div>
        </div>
      </section>

      <section className="webinar-promise" aria-labelledby="webinar-promise-title">
        <div className="shell"><p className="webinar-section-label">A smarter option</p><h2 id="webinar-promise-title">Build what you need.<br /><span>Pay for less of what you don’t.</span></h2><p className="webinar-promise__intro">This webinar shows you how to examine the work your business pays software to handle and find where AI could help you do it better. Not AI for its own sake. AI tied to a useful business result.</p><div className="webinar-promise__outcomes"><span>Lower avoidable costs</span><span>Less repetitive work</span><span>Better use of your data</span><span>More control</span></div><Link className="webinar-cta webinar-cta--dark" href="#register">Register for the webinar <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section id="what-you-will-learn" className="webinar-learning" aria-labelledby="webinar-learning-title">
        <div className="shell"><div className="webinar-learning__heading"><p className="webinar-section-label">What you’ll learn</p><h2 id="webinar-learning-title">From AI ideas to a better way to work.</h2><p>No jargon-filled tour of new apps. A practical way to decide what is worth changing.</p></div><div className="webinar-learning__list">{lessons.map((item) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><span aria-hidden="true">↗</span></article>)}</div><div className="webinar-learning__test"><strong>The test is simple.</strong><p>Did it save time or money? Improve delivery? Make the work easier? If not, it did not make business sense.</p></div></div>
      </section>

      <section className="webinar-examples" aria-labelledby="webinar-examples-title">
        <div className="shell webinar-examples__grid"><div><p className="webinar-section-label">Picture it in your business</p><h2 id="webinar-examples-title">What could change?</h2><p>The goal is not to rebuild every platform. It is to stop paying for complexity you do not need.</p></div><div className="webinar-examples__list">{examples.map(([before, after]) => <div key={before}><span>{before}</span><strong aria-hidden="true">→</strong><span>{after}</span></div>)}</div></div>
      </section>

      <section className="webinar-audience" aria-labelledby="webinar-audience-title"><div className="shell"><p className="webinar-section-label">Who should be in the room?</p><h2 id="webinar-audience-title">If tools are shaping your work, this is for you.</h2><div className="webinar-audience__list">{audiences.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="webinar-register" id="register" aria-labelledby="webinar-register-title"><div className="shell webinar-register__grid"><div className="webinar-register__copy"><p className="webinar-section-label">Your next step</p><h2 id="webinar-register-title">Knowing AI is not the advantage.<br /><span>Knowing what to do with it is.</span></h2><p>See what is possible before another tool becomes part of your monthly bill.</p><div className="webinar-register__date"><strong>Making AI Make Business Sense</strong><span>Saturday, 10 October 2026</span><span>6PM GMT+1 · Live online</span></div></div><RegistrationForm /></div></section>
    </div>
  );
}
