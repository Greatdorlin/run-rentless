import type { Metadata } from "next";
import { MoreDoneForm } from "./more-done-form";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "Build and test a useful business tool in seven guided days. Bring one real problem, choose your place and pay securely online.",
  alternates: { canonical: "/moredone" },
};

const projects = [
  ["01", "Customer tracker", "Bring enquiries from your website and social channels into one view. See who owns each reply.", "A sales process your team can use"],
  ["02", "Booking system", "Let customers choose a time, send confirmations and keep your team's calendar current.", "A booking flow for your business"],
  ["03", "Team workboard", "Track jobs, owners and due dates without chasing updates across chats.", "A shared view of the work"],
  ["04", "Business website", "Show your offer and collect bookings or quote requests in one place.", "A first site people can use"],
  ["05", "Reports that update", "Pull the numbers your team already records into a view you can check each week.", "A report tied to your data"],
  ["06", "AI team assistant", "Draft answers from approved company information, with a person reviewing before anything goes out.", "A checked, repeatable process"],
  ["07", "Client portal", "Give customers one place to submit requests and see the next step.", "A clearer service experience"],
  ["08", "A tool you can sell", "Turn a common client problem into a first working service and test whether people will pay for it.", "A service idea you can show"],
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
        <h1 id="md-title">Build the tool your business keeps wishing it had.</h1>
        <p className="md-hero__lede">Bring one job that takes too long or costs too much. In seven guided days, build a first working tool around it and test it with your team. No coding background needed.</p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Choose your place <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you could build ↓</a></div>
        <p className="md-hero__micro">Two live workshops and daily help across seven days.</p>
      </div>
      <div className="md-hero__visual" aria-label="Illustrative customer follow-up project">
        <div className="md-visual__top"><span>ONE POSSIBLE BUILD</span><span className="md-status"><i /> Customer enquiries</span></div>
        <div className="md-visual__body"><div className="md-visual__head"><span>Sales follow-up</span><strong>Every enquiry has a next step.</strong></div>
          <div className="md-visual__flow"><div><span>Customer</span><strong>Enquires</strong></div><b>→</b><div><span>Team</span><strong>Gets owner</strong></div><b>→</b><div><span>Follow-up</span><strong>Gets reminder</strong></div></div>
          <div className="md-visual__row"><span>New request</span><span>Assigned to Timi</span></div><div className="md-visual__row"><span>Quote sent</span><span>Check back tomorrow</span></div>
        </div><p>Example only. Your first build starts with a problem you choose.</p>
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

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>YOUR PROJECT</p><h2 id="md-projects-title">Choose a problem worth solving.</h2><span>These are starting points. We help you choose a version you can build and test in seven days.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><a className="md-underlink" href="#join">Choose your place and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">THE SEVEN DAYS</p><h2 id="md-days-title">A first version you can demonstrate.</h2><p>Two live 90-minute workshops, a daily task, starter materials and group help give your project a clear path from idea to test.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">ALSO INCLUDED</p><h2 id="md-ads-title">Plan an ad before you spend on one.</h2><p>The ChatGPT Ads lesson covers your offer, campaign plan and how to track enquiries. Access depends on your business and account approval. Ad spend is separate.</p><a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check current Ads Manager availability ↗</a></div><div className="md-ads__graphic" aria-hidden="true"><span>OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>FOLLOW-UP</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Come alone or bring the team.</h2><span>Select your places below and pay securely through Paystack.</span></div><div className="md-pricing__grid"><article><span>Individual</span><h3>₦120,000</h3><p>One place, including workshops, exercises, templates, group help and a review of your starter tool.</p><a href="?seats=1#join">Choose one place ↗</a></article><article className="md-pricing__team"><span>Team of three</span><h3>₦300,000</h3><p>Three colleagues can work on one business problem together. That is ₦60,000 less than three individual places.</p><a href="?seats=3#join">Choose three places ↗</a></article></div><p className="md-pricing__fine">Your fee covers the challenge and support shown here. If your project needs hosting or a paid service, we discuss the options before you spend anything extra.</p></div></section>
    <section className="md-guarantee"><div className="md-shell md-guarantee__layout"><strong>What we stand behind</strong><p>We agree on a realistic starter tool and a test before the challenge begins. Attend the required sessions and complete the exercises. If the tool misses that test, we provide another guided session at no charge. If our promised support still does not produce the agreed outcome, we refund the challenge fee.</p></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">MORE DONE</p><h2 id="md-join-title">Put your first idea to work.</h2><p>Choose one or three places, tell us the kind of tool you want to build, then pay through Paystack. We will send course information to your email.</p></div><MoreDoneForm /></div></section>
  </div>;
}
