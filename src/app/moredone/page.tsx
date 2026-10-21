import type { Metadata } from "next";
import { MoreDoneForm } from "./more-done-form";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "Your next employee could cost ₦3 million a year. Learn to build and test a tool for the work your business needs done.",
  alternates: { canonical: "/moredone" },
};

const projects = [
  ["01", "Customer tracker", "Keep WhatsApp, Instagram and website enquiries in one queue.", "A working sales view"],
  ["02", "Team workboard", "Give each job an owner and a clear due date.", "A shared task flow"],
  ["03", "Business website", "Show what you offer, then collect bookings or quote requests.", "A usable first site"],
  ["04", "Follow-up system", "Capture customer interest and prompt a timely reply.", "Fewer missed leads"],
  ["05", "AI work assistant", "Prepare drafts from approved business information for a person to check.", "A repeatable workflow"],
  ["06", "A tool you can sell", "Build a website or a follow-up system for another business, then charge for the work.", "A service you can offer"],
];
const days = [
  ["01", "Find the cost", "Bring one bill or recurring job. Decide what needs attention."],
  ["02", "Plan the tool", "Agree on a small first version and a test it should pass."],
  ["03–05", "Build and check", "Follow guided exercises and try the tool on a real example."],
  ["06–07", "Make it useful", "Plan an ad, show the tool and decide what to improve next."],
];

export default function MoreDonePage() {
  return <div className="md-page">
    <section className="md-hero" aria-labelledby="md-title"><div className="md-shell md-hero__grid">
      <div className="md-hero__copy">
        <p className="md-brandline">Run Rentless <span>×</span> Navrademy</p>
        <h1 id="md-title">Your next employee could cost ₦3 million a year.</h1>
        <p className="md-hero__lede">See how much of that work AI could handle first. Choose one problem your business needs solved, then spend seven days building and testing a tool for it. You do not need to know how to code.</p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Ask about the next cohort <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you can build ↓</a></div>
        <p className="md-hero__micro">Two live workshops · Daily exercises · Group support</p>
      </div>
      <div className="md-hero__visual" aria-label="Illustrative customer follow-up project">
        <div className="md-visual__top"><span>YOUR FIRST BUILD</span><span className="md-status"><i /> Working example</span></div>
        <div className="md-visual__body"><div className="md-visual__head"><span>Customer follow-up</span><strong>Know who needs a reply.</strong></div>
          <div className="md-visual__flow"><div><span>New enquiry</span><strong>Captured</strong></div><b>→</b><div><span>Owner</span><strong>Assigned</strong></div><b>→</b><div><span>Next step</span><strong>Scheduled</strong></div></div>
          <div className="md-visual__row"><span>WhatsApp enquiry</span><span>Follow up today</span></div><div className="md-visual__row"><span>Website enquiry</span><span>Quote to review</span></div>
        </div><p>Illustrative view. Your project depends on the problem you choose.</p>
      </div>
    </div></section>

    <section className="md-numbers" aria-labelledby="md-cost-title"><div className="md-shell">
      <div className="md-heading"><p>THE COST TO EXAMINE</p><h2 id="md-cost-title">Put a number on the work before you build.</h2><span>Start with your payroll and bank statement, whether the charge comes in naira or dollars. Include the cost of running any replacement tool.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>₦250k <em>/ month</em></strong><span>× 12</span><strong>₦3m <em>/ year</em></strong></div><p>Consider the follow-ups, quotations, records and reports that come with a new role. Could your team handle some of that work with a tool? A tool will not replace every job, but the question is worth asking before you hire.</p></div>
        <div className="md-software"><small>Foreign-currency tools · 15 seats</small><div><span>Pipedrive Growth</span><strong>$7,020</strong></div><div><span>Asana Advanced</span><strong>$4,498</strong></div><div className="md-software__total"><span>Combined annual list price</span><strong>$11,518</strong></div><p>Dollar list prices before tax, extras or card exchange fees. Sources: <a href="https://www.pipedrive.com/en/pricing" target="_blank" rel="noopener noreferrer">Pipedrive</a> and <a href="https://asana.com/pricing" target="_blank" rel="noopener noreferrer">Asana</a>.</p></div>
      </div>
      <div className="md-savings" aria-label="Illustrative annual savings on the software example"><div><span>15% reduction</span><strong>$1,728</strong></div><div><span>25% reduction</span><strong>$2,880</strong></div><div><span>35% reduction</span><strong>$4,031</strong></div><p>Rounded annual scenarios on the example bill. Your results may differ; savings are not guaranteed.</p></div>
    </div></section>

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>YOUR PROJECT</p><h2 id="md-projects-title">Pick the tool you would actually use.</h2><span>You build one achievable first version. We help you set its scope before the challenge starts.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><a className="md-underlink" href="#join">Tell us what you want to build ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">THE SEVEN DAYS</p><h2 id="md-days-title">A first version you can demonstrate.</h2><p>Two live 90-minute workshops, a daily task, starter materials and group help give your project a clear path from idea to test.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">ALSO INCLUDED</p><h2 id="md-ads-title">Plan an ad before you spend on one.</h2><p>The ChatGPT Ads lesson covers your offer, campaign plan and how to track enquiries. Access depends on your business and account approval. Ad spend is separate.</p><a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check current Ads Manager availability ↗</a></div><div className="md-ads__graphic" aria-hidden="true"><span>OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>FOLLOW-UP</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Come alone or bring the team.</h2><span>Request next-cohort details below. This page does not take a payment.</span></div><div className="md-pricing__grid"><article><span>Individual</span><h3>₦120,000 <small>or $100</small></h3><p>One place, including workshops, exercises, templates, group help and a review of your starter tool.</p><a href="#join">Ask for an individual place ↗</a></article><article className="md-pricing__team"><span>Team of three</span><h3>₦300,000 <small>or $250</small></h3><p>Three colleagues can tackle one business problem. Save ₦60,000 or $50 against three individual places.</p><a href="#join">Ask about a team place ↗</a></article></div><p className="md-pricing__fine">Hosting, paid software and ad spend may cost extra. We discuss needed services before you build.</p></div></section>
    <section className="md-guarantee"><div className="md-shell md-guarantee__layout"><strong>What we stand behind</strong><p>We agree on a realistic starter tool and a test before the challenge begins. Attend the required sessions and complete the exercises. If the tool misses that test, we provide another guided session at no charge. If our promised support still does not produce the agreed outcome, we refund the challenge fee.</p></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">MORE DONE</p><h2 id="md-join-title">What would you build first?</h2><p>Tell us which place you want. We will contact you with the next-cohort details and joining steps.</p></div><MoreDoneForm /></div></section>
  </div>;
}
