import type { Metadata } from "next";
import { MoreDoneForm } from "./more-done-form";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "MoreDone is a 7-day AI business challenge. Choose a tool your business needs, build a working first version with guidance, and test it on a real job.",
  alternates: { canonical: "/moredone" },
};

const projects = [
  ["01", "Customer tracker", "See every new enquiry, who needs to reply and which customer is waiting.", "Know who needs a reply"],
  ["02", "Booking system", "Let customers pick a time and get a confirmation without a long WhatsApp exchange.", "Make booking easier"],
  ["03", "Team workboard", "Give your team one place to see who is doing what and when it is due.", "Keep work moving"],
  ["04", "Business website", "Show what you sell and let visitors ask for a quote or book a call.", "Get a useful first website"],
  ["05", "Weekly reports", "Bring the numbers you already collect into one report you can check quickly.", "See what changed this week"],
  ["06", "AI team assistant", "Help your team find answers in company documents. Check its answers before using them.", "Answer common questions faster"],
  ["07", "Customer request page", "Let customers send a request and see what happens next.", "Keep requests in one place"],
  ["08", "A tool for clients", "Build a small working version of an idea your clients keep asking for.", "Test an idea you could sell"],
];
const days = [
  ["01", "Choose the job", "Pick one task your business needs help with."],
  ["02", "Make a simple plan", "Decide what the first version needs to do."],
  ["03–05", "Build with guidance", "Work through the lessons and try your tool with a real example."],
  ["06–07", "Test and improve", "Show us what works, fix what does not and plan what comes next."],
];

export default function MoreDonePage() {
  return <div className="md-page">
    <section className="md-hero" aria-labelledby="md-title"><div className="md-shell md-hero__grid">
      <div className="md-hero__copy">
        <p className="md-brandline">Run Rentless <span>×</span> Navrademy</p>
        <p className="md-program">MoreDone: The 7-Day AI Business Challenge</p>
        <h1 id="md-title">Build the tool your business keeps wishing it had.</h1>
        <p className="md-hero__lede">Your team knows the work that takes too long. Pick one problem and spend seven days using AI to build a tool that helps. We guide you from the first idea to a working test. You do not need to know how to code.</p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Join for ₦120,000 <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you could build ↓</a></div>
        <p className="md-hero__micro">Coming with colleagues? Three places cost ₦300,000.</p>
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
      <div className="md-heading"><p>START WITH A REAL PROBLEM</p><h2 id="md-cost-title">The work is growing. Your team is already busy.</h2><span>Before you hire another person or add another subscription, see whether a simple tool could take care of part of the work.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>₦250k <em>/ month</em></strong><span>× 12</span><strong>₦3m <em>/ year</em></strong></div><p>That is one example salary, not a promise to replace a person. If much of the role would involve copying details, sending reminders or updating records, try making that work easier first.</p></div>
        <div className="md-software"><small>Before another subscription</small><h3>How many tools are doing one job?</h3><p>A booking tool takes the request. A spreadsheet tracks it. Your team still sends the reminder. Bring that process to the challenge and see which parts you could run in one tool.</p></div>
      </div>
    </div></section>

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>WHAT COULD YOU BUILD?</p><h2 id="md-projects-title">Start with the job you wish was easier.</h2><span>Choose an idea below or bring your own. We will help you make a first version you can test in seven days.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><a className="md-underlink" href="#join">Choose your place and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">HOW THE WEEK WORKS</p><h2 id="md-days-title">You build it with us.</h2><p>Join two live 90-minute workshops. Each day you get a small task, examples to work from and help when you get stuck. By the end, you will have a first version to try on a real job.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">ALSO IN THE CHALLENGE</p><h2 id="md-ads-title">Know what to say when you share your tool.</h2><p>We will help you explain your offer, plan an ad and see whether enquiries turn into customers. You decide if you want to run the ad. Ad costs are separate.</p></div><div className="md-ads__graphic" aria-hidden="true"><span>OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>FOLLOW-UP</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Build on your own or bring two teammates.</h2><span>Both options include the same lessons and help. Pick the number of people coming with you.</span></div><div className="md-pricing__grid"><article><span>Individual</span><h3>₦120,000</h3><p>One place. Join the live workshops, use the examples and get help testing your first tool.</p><a href="?seats=1#join">Choose one place ↗</a></article><article className="md-pricing__team"><span>Team of three</span><h3>₦300,000</h3><p>Bring two colleagues and work on one business problem together. You save ₦60,000 compared with three individual places.</p><a href="?seats=3#join">Choose three places ↗</a></article></div><p className="md-pricing__fine">If your project needs hosting or another paid service, we will explain the options before you spend more.</p></div></section>
    <section className="md-guarantee"><div className="md-shell md-guarantee__layout"><strong>What if my tool does not work?</strong><p>Before the challenge, we agree on one small tool and what it needs to do. Come to the required sessions and finish the exercises. If your tool does not pass that test, we will help you again in an extra session for free. If our promised help still does not get it working as agreed, we will refund your challenge fee.</p></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">JOIN MOREDONE</p><h2 id="md-join-title">Tell us what you want to build.</h2><p>Choose one or three places and share your idea. Paystack takes your payment, and we will email you the challenge details.</p></div><MoreDoneForm /></div></section>
  </div>;
}
