import type { Metadata } from "next";
import { MoreDoneForm } from "./more-done-form";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "Join MoreDone on your own or with your team. In seven days, use AI to build and test a useful website or business tool with guidance.",
  alternates: { canonical: "/moredone" },
};

const projects = [
  ["01", "Your own customer tracker", "A new enquiry comes in. Your team sees who will reply, what was promised and when to follow up.", "Keep every customer conversation in view"],
  ["02", "A booking system", "Customers choose an available time. The booking appears on your calendar and they get a confirmation.", "Spend less time arranging appointments"],
  ["03", "A team task manager", "A job has an owner, a deadline and a clear status. Your team can check progress without another meeting.", "Know what is moving and what is stuck"],
  ["04", "A website that wins enquiries", "Give people a clear reason to choose you, then make it easy to ask for a quote or book a call.", "Make your website useful for sales"],
  ["05", "A sales follow-up system", "A lead arrives from your website. The right person gets it, and the system reminds them if the customer is still waiting.", "Give more leads a timely reply"],
  ["06", "An AI assistant for routine work", "Use approved company information to draft replies or quotes. Your team checks each one before sending it.", "Free up time for customer work"],
  ["07", "A weekly business report", "Bring sales and other numbers into one view so you can see what changed without rebuilding a spreadsheet.", "Make decisions with current numbers"],
  ["08", "A tool you could sell", "Build a first version of something clients ask you to do repeatedly, then show it to a real potential buyer.", "Test a new service idea"],
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
        <p className="md-hero__lede">Bring a problem from your business or an idea you want to build for clients. In seven days, we will help you make a working first version with AI, even if you have never coded.</p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Join the cohort <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you could build ↓</a></div>
        <p className="md-hero__micro">Bringing your team? <a href="#md-pricing-title">Get the team offer ↗</a></p>
      </div>
      <div className="md-hero__visual" aria-label="Illustrative customer follow-up project">
        <div className="md-visual__top"><span>ONE POSSIBLE BUILD</span><span className="md-status"><i /> Customer enquiries</span></div>
        <div className="md-visual__body"><div className="md-visual__head"><span>Sales follow-up</span><strong>Every enquiry has a next step.</strong></div>
          <div className="md-visual__flow"><div><span>Customer</span><strong>Enquires</strong></div><b>→</b><div><span>Team</span><strong>Gets owner</strong></div><b>→</b><div><span>Follow-up</span><strong>Gets reminder</strong></div></div>
          <div className="md-visual__row"><span>New request</span><span>Assigned to Timi</span></div><div className="md-visual__row"><span>Quote sent</span><span>Check back tomorrow</span></div>
        </div><p>Example only. Your first build starts with a problem you choose.</p>
      </div>
    </div></section>

    <section className="md-for" aria-label="Who can join MoreDone"><div className="md-shell md-for__grid">
      <div><strong>Have a business?</strong><p>Build a tool for the work your team keeps repeating, from customer follow-up to bookings.</p></div>
      <div><strong>Joining on your own?</strong><p>Learn to make websites and useful tools you can use at work or offer to clients. You only need one idea to start.</p></div>
    </div></section>

    <section className="md-numbers" aria-labelledby="md-cost-title"><div className="md-shell">
      <div className="md-heading"><p>START WITH A REAL PROBLEM</p><h2 id="md-cost-title">The work is growing. Your team is already busy.</h2><span>Before you hire another person or add another subscription, see whether a simple tool could take care of part of the work.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>₦250k <em>/ month</em></strong><span>× 12</span><strong>₦3m <em>/ year</em></strong></div><p>That is one example salary, not a promise to replace a person. If much of the role would involve copying details, sending reminders or updating records, try making that work easier first.</p></div>
        <div className="md-software"><small>Before another subscription</small><h3>Your team needs the result, not another login.</h3><p>A customer books a call. The details still need copying, someone has to assign the enquiry, and a sales rep must remember to follow up. Build a simple way to keep that job moving in one place.</p></div>
      </div>
    </div></section>

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>WHAT COULD YOU BUILD?</p><h2 id="md-projects-title">One useful build can open a lot of doors.</h2><span>Choose an idea below or bring your own. You will build one starter tool during the challenge, with a clear job to test it on.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><div className="md-website"><div><span>BUILDING A WEBSITE?</span><h3>Make it look like your business, not an AI template.</h3></div><p>We will show you how to plan a page, guide AI toward a better design, write clear words and check the result on a phone. You will also learn how to handle forms and customer details safely before publishing.</p></div><a className="md-underlink" href="#join">Join the cohort and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">HOW THE WEEK WORKS</p><h2 id="md-days-title">You build it with us.</h2><p>Join two live 90-minute workshops. Each day you get a small task, examples to work from and help when you get stuck. By the end, you will have a first version to try on a real job and a way to start your next idea.</p><p className="md-days__tools"><strong>What to bring:</strong> You will need Claude or enough Codex access through your ChatGPT plan for the week. A paid plan or extra credits may be needed and are not included in the challenge fee. We will show you how to set up your tool.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">ALSO IN THE CHALLENGE</p><h2 id="md-ads-title">Build the tool. Give people a reason to use it.</h2><p>A good website or tool needs customers. We will help you make the offer clear, create a page people can act on and prepare an ad that sends them there. You will see how to track enquiries and sales, so you can judge whether the ad is worth paying for.</p><p>We also cover ChatGPT Ads while the channel is growing. If your business has access, you can prepare a campaign for review. Ad spend is separate. <a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check where Ads Manager is available ↗</a></p></div><div className="md-ads__graphic" aria-hidden="true"><span>OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>FOLLOW-UP</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Build on your own or bring two teammates.</h2><span>Both options include the same lessons and help. Pick the number of people coming with you.</span></div><div className="md-pricing__grid"><article><span>Join on your own</span><h3>₦120,000</h3><p>Bring a problem from work, your own business or a client idea. You get the live workshops and help testing your first build.</p><a href="?seats=1#join">Choose one place ↗</a></article><article className="md-pricing__team"><span>Bring two teammates</span><h3>₦300,000</h3><p>Work on one business problem together. Three places cost ₦60,000 less than buying them separately.</p><a href="?seats=3#join">Choose three places ↗</a></article></div><p className="md-pricing__fine">If your project needs hosting or another paid service, we will explain the options before you spend more.</p></div></section>
    <section className="md-guarantee"><div className="md-shell md-guarantee__layout"><strong>What if my tool does not work?</strong><p>Before the challenge, we agree on one small tool and what it needs to do. Come to the required sessions and finish the exercises. If your tool does not pass that test, we will help you again in an extra session for free. If our promised help still does not get it working as agreed, we will refund your challenge fee.</p></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">JOIN MOREDONE</p><h2 id="md-join-title">Tell us what you want to build.</h2><p>Choose one or three places and share your idea. Paystack takes your payment, and we will email you the challenge details.</p></div><MoreDoneForm /></div></section>
  </div>;
}
