import type { Metadata } from "next";
import Image from "next/image";
import { WebinarAnchor } from "@/components/webinar/webinar-anchor";
import { siAirtable, siAsana, siCalendly, siHubspot, siMailchimp, siZapier } from "simple-icons";
import { WebinarCountdown } from "@/components/webinar/countdown";
import { RegistrationForm } from "@/components/webinar/registration-form";
import "./webinar.css";

export const metadata: Metadata = {
  title: "Making AI Make Business Sense | Live Webinar",
  description: "Join Navrademy and Run Rentless on 10th October 2026 at 6PM GMT+1. Bring one costly tool or slow task and learn where AI could make work easier and reduce unnecessary software costs.",
  alternates: { canonical: "/webinar" },
  openGraph: {
    title: "Making AI Make Business Sense | Live Webinar",
    description: "Bring one costly tool or slow task. Learn what AI could help your business keep, improve or build. Saturday, 10th October 2026 at 6PM GMT+1.",
    url: "https://www.runrentless.com/webinar",
    type: "website",
    images: [
      {
        url: "https://www.runrentless.com/webinar/making-ai-make-business-sense.png",
        width: 1731,
        height: 909,
        alt: "Making AI Make Business Sense live webinar, presented by Navrademy and Run Rentless",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Making AI Make Business Sense | Live Webinar",
    description: "Bring one costly tool or slow task. Learn what AI could help your business keep, improve or build.",
    images: ["https://www.runrentless.com/webinar/making-ai-make-business-sense.png"],
  },
};

const lessons = [
  { title: "See where your money goes", copy: "Start with your actual bills. Find the tools that cost the most and the charges that rise as your team grows." },
  { title: "Find the work you still do manually", copy: "Spot the information your team copies, the follow-ups they chase and the jobs several tools are doing together." },
  { title: "Know what to keep, connect or build", copy: "A useful tool may be worth the fee. Another may need a better setup. A focused job may be worth building for your business." },
  { title: "Avoid an expensive mistake", copy: "Learn what to check before you build: your data, who can use the tool, how to test it and what it will cost to run." },
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
  ["Customer details in three spreadsheets", "One place to find the latest details"],
  ["Leads copied manually, then forgotten", "A clear follow-up for every lead"],
  ["Finance checks several tools for one answer", "The numbers in one useful view"],
  ["Client updates spread across different apps", "One way to track the job from start to finish"],
];

const audiences = [
  ["Business owners & founders", "Your software bill keeps rising, but the work has not become easier."],
  ["Sales, marketing & operations teams", "Your team still copies updates, chases follow-ups and switches between too many tools."],
  ["Agencies & consultants", "Clients want faster work and clearer results. You want a practical way to deliver both."],
  ["People learning AI", "You want to solve a business problem, not just show someone another AI trick."],
];

export default function WebinarPage() {
  return (
    <div className="webinar-page">
      <section className="webinar-hero" aria-labelledby="webinar-title">
        <div className="shell webinar-hero__grid">
          <div className="webinar-hero__copy">
            <p className="webinar-kicker"><span /> Navrademy × Run Rentless present <em>Live webinar</em></p>
            <h1 id="webinar-title">Making AI make <span>business sense.</span></h1>
            <p className="webinar-hero__lead">Everyone is showing you what AI can do. Let’s shift the conversation to where it could help your business cut costs and grow revenue.</p>
            <div className="webinar-hero__event"><strong>Saturday, 10th October 2026</strong><span>6PM GMT+1 · Live online</span></div>
            <div className="webinar-hero__actions"><WebinarAnchor className="webinar-cta" href="#webinar-form">Get a spot <span aria-hidden="true">↗</span></WebinarAnchor><WebinarAnchor className="webinar-hero__secondary" href="#what-you-will-learn">See what you’ll learn <span aria-hidden="true">↓</span></WebinarAnchor></div>
            <p className="webinar-hero__takeaway">You do not need a technical background. You need a problem worth solving.</p>
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
          <div><p className="webinar-section-label">Does this sound familiar?</p><h2 id="webinar-problem-title">More tools.<br /><span>Still more work.</span></h2></div>
          <div className="webinar-problem__story"><p>A customer fills in a form. Someone copies the details into a spreadsheet. Someone else adds them to the sales tool. Then the team still has to chase the follow-up.</p><p>You are paying for the tools and paying with your team’s time.</p><strong>In this webinar, we will show you how to find the work your tools should already make easier.</strong></div>
        </div>
      </section>

      <figure className="webinar-featured">
        <div className="shell"><Image src="/webinar/making-ai-make-business-sense.png" width={1731} height={909} sizes="(max-width: 700px) 100vw, 1200px" alt="Making AI Make Business Sense webinar artwork with Navrademy and Run Rentless branding" /></div>
      </figure>

      <section className="webinar-tools" aria-labelledby="webinar-tools-title">
        <div className="shell webinar-tools__grid">
          <div className="webinar-tools__copy"><p className="webinar-section-label">Look at your current tools</p><h2 id="webinar-tools-title">How many tools does one job need?</h2><p>One for sales. One for email. One for bookings. Another to pass information between them. Each may be useful, but you could still be paying for extra steps.</p><div className="webinar-tools__question"><strong>What if you built only the part your business needs?</strong><span>Could that cut some of your software costs by 40% or more? It depends on your setup. We will show you what to compare before you decide.</span></div><WebinarAnchor className="webinar-tools__link" href="#webinar-form">Get a spot <span aria-hidden="true">↗</span></WebinarAnchor></div>
          <div className="webinar-tools__list" aria-label="Examples of business software tools">{familiarTools.map(({ name, icon, job }) => <div className="webinar-tools__item" key={name}><span className="webinar-tools__icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={icon.path} fill={`#${icon.hex}`} /></svg></span><span className="webinar-tools__name">{name}<small>{job}</small></span></div>)}</div>
        </div>
        <p className="shell webinar-tools__note">Brand marks are shown only as familiar examples. Run Rentless is not affiliated with these companies.</p>
      </section>

      <section className="webinar-promise" aria-labelledby="webinar-promise-title">
        <div className="shell"><p className="webinar-section-label">Why this webinar is different</p><h2 id="webinar-promise-title">Your business first.<br /><span>AI second.</span></h2><p className="webinar-promise__intro">Most AI classes show you what a new tool can do. We start with what your team pays for and the work it still does manually. Then we look at where AI could help, what you can leave alone and how to judge the cost.</p><div className="webinar-promise__outcomes"><span>Keep what works</span><span>Fix repeated work</span><span>Build what is missing</span><span>Know what it costs</span></div><WebinarAnchor className="webinar-cta webinar-cta--dark" href="#webinar-form">Get a spot <span aria-hidden="true">↗</span></WebinarAnchor></div>
      </section>

      <section id="what-you-will-learn" className="webinar-learning" aria-labelledby="webinar-learning-title">
        <div className="shell"><div className="webinar-learning__heading"><p className="webinar-section-label">What you will get</p><h2 id="webinar-learning-title">A way to make the next decision.</h2><p>You will know what to ask before paying for another tool or asking someone to build one.</p></div><div className="webinar-learning__list">{lessons.map((item) => <article key={item.title}><span className="webinar-learning__marker" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div><span aria-hidden="true">↗</span></article>)}</div><div className="webinar-learning__test"><strong>Bring a real problem</strong><p>Think of one bill that feels too high or one task your team does manually. This session will help you see what could change and what to check before you spend more.</p></div></div>
      </section>

      <section className="webinar-examples" aria-labelledby="webinar-examples-title">
        <div className="shell webinar-examples__grid"><div><p className="webinar-section-label">Picture it in your business</p><h2 id="webinar-examples-title">What could you make easier?</h2><p>You may not need a whole new system. Sometimes one better step changes the day.</p></div><div className="webinar-examples__list">{examples.map(([before, after]) => <div key={before}><span>{before}</span><strong aria-hidden="true">→</strong><span>{after}</span></div>)}</div></div>
      </section>

      <section className="webinar-audience" aria-labelledby="webinar-audience-title"><div className="shell"><p className="webinar-section-label">Who should join</p><h2 id="webinar-audience-title">If you pay for tools and still do the work manually, this is for you.</h2><div className="webinar-audience__list">{audiences.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="webinar-register" id="register" aria-labelledby="webinar-register-title"><div className="shell webinar-register__grid"><div className="webinar-register__copy"><p className="webinar-section-label">Join us live</p><h2 id="webinar-register-title">Bring the problem.<br /><span>Leave with a way forward.</span></h2><p>Come with one expensive tool or one task that takes too much time. Learn how to judge whether to keep it, improve it or build something better. You do not need to know how to code.</p><div className="webinar-register__date"><strong>Making AI Make Business Sense</strong><span>Saturday, 10th October 2026</span><span>6PM GMT+1 · Live online</span></div></div><div id="webinar-form"><RegistrationForm /></div></div></section>
    </div>
  );
}
