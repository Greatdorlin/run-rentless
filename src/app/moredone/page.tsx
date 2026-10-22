import type { Metadata } from "next";
import { headers } from "next/headers";
import { moreDonePlans, moreDonePrice, type MoreDoneCountry, type MoreDoneSeats } from "@/lib/moredone";
import { MoreDoneForm } from "./more-done-form";
import { CountrySwitcher } from "./country-switcher";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "In seven days, build and test a customer tracker, booking app, website or AI tool for your business, your job or a client. No coding experience needed.",
  alternates: { canonical: "/moredone" },
};

const projects = [
  ["01", "A customer tracker that fits", "Keep customer details and next steps in one place. Build the reminder or follow-up your current sales tool is missing, then try it with a real lead.", "Know who needs a reply"],
  ["02", "A booking system", "A customer picks a free slot and gets a confirmation. Your team sees the booking in one place instead of trading messages to settle a time.", "Let customers book without the back-and-forth"],
  ["03", "A task board for your team", "Give each job an owner and a deadline. Everyone can see what is due without asking for another progress update.", "Know what needs doing next"],
  ["04", "A website that feels like yours", "Show customers the business you have worked hard to build. Give them a clear path to ask for a quote, book or buy.", "Make a better first impression"],
  ["05", "A sales follow-up system", "Someone clicks your ad and asks for a quote. The enquiry reaches the right person, with a reminder before the customer gets forgotten.", "Give each paid lead a proper follow-up"],
  ["06", "An assistant for repeat work", "Give it information you approve and let it prepare a first draft of a quote or customer reply. A person checks it before it goes out.", "Spend less time starting from scratch"],
  ["07", "A weekly business report", "Bring your sales and delivery numbers into one view. See which jobs need attention without rebuilding the same spreadsheet before every meeting.", "Know where the week stands"],
  ["08", "A tool you could sell", "Build a booking app, customer tracker or other tool a client needs. Show them a working first version and offer to set it up for their business.", "Turn your new skill into a service"],
];
const days = [
  ["01", "Choose the job", "Bring the customer, team or sales task you want your tool to handle."],
  ["02", "Map how it should work", "Decide what goes in, what happens next and what a good result looks like."],
  ["03–05", "Build your first version", "Make the main feature work, then try it with an example from your business."],
  ["06", "Plan how to find customers", "Prepare an offer, a page and a way to track enquiries from your ads."],
  ["07", "Show the working tool", "Run the agreed test and leave with a clear next step for using or improving it."],
];

export default async function MoreDonePage({ searchParams }: { searchParams: Promise<{ country?: string; region?: string }> }) {
  const requested = await searchParams;
  const detected = (await headers()).get("x-vercel-ip-country")?.toUpperCase();
  const country: MoreDoneCountry = requested.country === "ng" || requested.country === "rw" || requested.country === "other"
    ? requested.country
    : requested.region === "ng" ? "ng" : requested.region === "international" ? "other"
    : detected === "NG" ? "ng" : detected === "RW" ? "rw" : "other";
  const isNigeria = country === "ng";
  const amount = (seats: MoreDoneSeats) => moreDonePrice(seats, country);
  const savings = (seats: MoreDoneSeats) => country === "ng"
    ? `₦${((moreDonePlans[1].amount * seats - moreDonePlans[seats].amount) / 100).toLocaleString("en-NG")}`
    : country === "rw" ? `RWF ${(moreDonePlans[1].rwf * seats - moreDonePlans[seats].rwf).toLocaleString("en-RW")}`
    : `$${moreDonePlans[1].usd * seats - moreDonePlans[seats].usd}`;
  const offers = [
    { seats: 1 as const, note: "Bring a business problem or a client idea. Build your first working version with us." },
    ...(!isNigeria ? [{ seats: 2 as const, note: "Bring one colleague and build together. You both save on individual places." }] : []),
    { seats: 3 as const, note: "Bring two colleagues to build around one real business need." },
    { seats: 5 as const, note: "Bring more of your team into the build. Pay less per person." },
  ];
  return <div className="md-page">
    <section className="md-hero" aria-labelledby="md-title"><div className="md-shell md-hero__grid">
      <div className="md-hero__copy">
        <div className="md-hero__top"><p className="md-brandline">Run Rentless <span>×</span> Navrademy</p><CountrySwitcher country={country} /></div>
        <p className="md-program">MoreDone: The 7-Day AI Business Challenge</p>
        <h1 id="md-title">Build the tool your business keeps wishing it had.</h1>
        <p className="md-hero__lede">Bring a business problem you want fixed. In seven days, we will help you build and test a working first version of the tool you need for your company, your job or a client. No coding experience needed.</p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Join the cohort <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you could build ↓</a></div>
        <p className="md-hero__micro">Bringing your team? <a href="#team-offer">See the team offer ↗</a></p>
      </div>
      <div className="md-hero__visual" aria-label="Illustration of a customer follow-up tool you could build">
        <div className="md-visual__top"><span>ONE POSSIBLE BUILD</span><span className="md-status"><i /> CUSTOMER FOLLOW-UP</span></div>
        <div className="md-visual__body">
          <div className="md-visual__head"><span>YOUR OWN SALES TOOL</span><strong>Every customer. Every next step.</strong></div>
          <div className="md-visual__summary"><span>NEW ENQUIRY</span><b aria-hidden="true">→</b><span>RIGHT PERSON</span><b aria-hidden="true">→</b><span>TIMELY REPLY</span></div>
          <div className="md-visual__list-label"><span>CUSTOMER WORK</span><span>NEXT ACTION</span></div>
          <div className="md-visual__item"><div><i className="md-visual__dot" /><span><strong>Website enquiry</strong><small>Someone asked for a quote</small></span></div><em>Assign owner ↗</em></div>
          <div className="md-visual__item"><div><i className="md-visual__dot md-visual__dot--orange" /><span><strong>Quote sent</strong><small>Customer is waiting to hear back</small></span></div><em>Follow up today ↗</em></div>
        </div>
        <div className="md-visual__foot"><span>BUILT AROUND YOUR WORK</span><span>NOT ANOTHER GENERIC APP <b aria-hidden="true">↗</b></span></div>
        <p>Illustration only. Your first build starts with a problem you choose.</p>
      </div>
    </div></section>

    <div className="md-sticky-cta"><a href="#join">Join the cohort <span aria-hidden="true">↗</span></a></div>
    <section className="md-for" aria-label="Who can join MoreDone"><div className="md-shell md-for__grid">
      <div><strong>Run a business?</strong><p>Build the customer tracker, booking app or website your business needs. Start with one job you want to make easier.</p></div>
      <div><strong>Joining on your own?</strong><p>Build a tool for your work or a client. You will learn a skill you can keep using after the challenge.</p></div>
    </div></section>

    <section className="md-numbers" aria-labelledby="md-cost-title"><div className="md-shell">
      <div className="md-heading"><h2 id="md-cost-title">Build a tool someone already needs.</h2><span>Think of a job that keeps coming back, such as booking customers or following up on sales. We will help you turn it into a working tool. Use it in your business, at work or for a client.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>{country === "ng" ? "₦250k" : country === "rw" ? "RWF 500k" : "$500"} <em>/ month</em></strong><span>× 12</span><strong>{country === "ng" ? "₦3m" : country === "rw" ? "RWF 6m" : "$6k"} <em>/ year</em></strong></div><p>{country === "ng" ? "A ₦250,000 monthly salary adds ₦3 million a year." : country === "rw" ? "A RWF 500,000 monthly salary adds RWF 6 million a year." : "A $500 monthly salary adds $6,000 a year."} Before hiring someone to handle repeat work, build a tool for one part of that job, such as tracking customer replies or preparing weekly updates. If you work alone, this is also a problem you can learn to solve for clients.</p></div>
        <div className="md-software"><small>Before another subscription</small><h3>Pay for the parts you use. Build the part you need.</h3><p>A company may pay for a customer management tool and still need a separate way to remind staff when a lead needs a reply. In the challenge, build that missing step and try it with a real example. If you work with clients, you can build the same kind of fix for them.</p><div className="md-software__example"><strong>See how quickly software bills add up</strong><span>Pipedrive Growth is $39 per seat each month and Asana Advanced is $24.99, both billed annually. For 15 people on each, that is <b>$11,518 a year</b>. For perspective, 15% of that bill is <b>$1,728 a year</b>. Use your own bills to decide what is worth keeping and what you want to build.</span><small><a href="https://www.pipedrive.com/en/pricing" target="_blank" rel="noopener noreferrer">Pipedrive pricing</a> · <a href="https://asana.com/pricing" target="_blank" rel="noopener noreferrer">Asana pricing</a></small></div></div>
      </div>
    </div></section>

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR FIRST BUILD</p><h2 id="md-projects-title">What would you like to make?</h2><span>Pick an idea below or bring your own. You will build one working first version during the challenge, whether it is for you, your employer or a client.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><div className="md-website"><div><span>FOR WEBSITES AND INTERNAL TOOLS</span><h3>Make something you are proud to put your name on.</h3></div><p>We will help you make your tool look and sound like the business it serves. You will check it on a phone and learn how to protect customer details before sharing it. You can change an AI-generated design that feels generic.</p></div><a className="md-underlink" href="#join">Join the cohort and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">HOW THE WEEK WORKS</p><h2 id="md-days-title">Leave with a tool you can show someone.</h2><p>Join two live 90-minute workshops and make progress on your build each day. We will help you get its main feature working and try it with a real example. You will also learn to give your AI tool instructions and check its work from your phone.</p><p className="md-days__tools">You will need a paid AI building tool for the week. Its subscription is separate from the challenge fee. After joining, we will help you choose one and set it up.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">A CHANCE TO LEARN A NEW AD CHANNEL EARLY</p><h2 id="md-ads-title">ChatGPT Ads is growing. Learn how to use it while it is new.</h2><p>Businesses that learned Facebook Ads early had time to test what brought customers to them. ChatGPT Ads offers another chance to learn a growing channel. In October 2026, it reached 89 countries, and more than 100,000 advertisers had used it. More than 1.2 billion people use ChatGPT each week.</p><p>We will help you prepare an offer, an ad and the page people visit after clicking. You will leave with a way to record enquiries and see which become customers. Where ChatGPT Ads is available to your business, you will know how to submit your first test.</p><p className="md-ads__source"><a href="https://openai.com/index/chatgpt-ads-expands-26-new-countries/" target="_blank" rel="noopener noreferrer">See the ChatGPT Ads announcement ↗</a> · <a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check country access ↗</a></p></div><div className="md-ads__graphic" aria-label="From a clear offer to an ad, enquiry and sale"><span>YOUR OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>SALE</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Join alone or bring your team.</h2><span>Every place includes the workshops, daily exercises and help with your build. Team packages cost less per person.</span></div><div className={`md-pricing__grid${isNigeria ? "" : " md-pricing__grid--four"}`}>{offers.map(({ seats, note }) => <article key={seats} className={seats > 1 ? "md-pricing__team" : undefined} id={seats === 3 ? "team-offer" : undefined}><span>{moreDonePlans[seats].label}{seats > 1 ? ` · save ${savings(seats)}` : ""}</span><h3>{amount(seats)}</h3><p>{note}</p><a href={`?seats=${seats}&country=${country}#join`}>Choose {moreDonePlans[seats].label.toLowerCase()} ↗</a></article>)}</div><p className="md-pricing__fine">Prices are shown for {country === "ng" ? "Nigeria" : country === "rw" ? "Rwanda" : "Global"}. <a href="#md-country">Change country ↑</a> A paid AI building tool, hosting and ad spend are separate where needed; we explain your options before you use them.</p></div></section>
    <section className="md-faq" aria-labelledby="md-faq-title"><div className="md-shell md-faq__layout"><h2 id="md-faq-title">Questions before you join</h2><div className="md-faq__list"><details><summary>Can I get a refund?</summary><p>Yes. Before the challenge starts, we agree on the first tool you will build and how to test it in your business. Attend the classes and complete the exercises. If you follow the guidance and your tool still fails that agreed test, we will give you another guided session at no cost. If it still fails, we will refund your challenge fee.</p></details><details><summary>Do I need to know how to code?</summary><p>No. Bring a business problem or an idea for a client. We will guide you through building a first working version with AI.</p></details></div></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">JOIN MOREDONE</p><h2 id="md-join-title">Tell us what you want to build.</h2><p>Choose how many people are joining and share your idea. {isNigeria ? "Pay securely online to join the challenge." : "Send your details to get payment instructions and secure your place."}</p></div><MoreDoneForm country={country} /></div></section>
  </div>;
}
