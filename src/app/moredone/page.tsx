import type { Metadata } from "next";
import { headers } from "next/headers";
import { moreDonePlans, moreDonePrice, type MoreDoneCountry, type MoreDoneSeats } from "@/lib/moredone";
import { MoreDoneForm } from "./more-done-form";
import { CountrySwitcher } from "./country-switcher";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "Build and test a first version of the CRM, website, booking tool or AI assistant your business needs in seven days with Run Rentless and Navrademy.",
  alternates: { canonical: "/moredone" },
};

const projects = [
  ["01", "A CRM that fits your business", "The CRM bill arrives every month, but your team still tracks a missing step elsewhere. Build the customer view or follow-up you have been asking for, then test it with a real lead.", "Start with the missing feature"],
  ["02", "A booking system", "A customer picks a free slot and gets a confirmation. Your team sees the booking in one place instead of trading messages to settle a time.", "Let customers book without the back-and-forth"],
  ["03", "A team task manager", "A new job gets an owner and a deadline. The team can see who has it and when it is due without calling another meeting.", "Give every job a clear owner"],
  ["04", "A website that feels like yours", "Show customers the business you have worked hard to build. Give them a clear path to ask for a quote, book or buy.", "Make a better first impression"],
  ["05", "A sales follow-up system", "Someone clicks your ad and asks for a quote. The enquiry reaches the right person, with a reminder before the customer gets forgotten.", "Give each paid lead a proper follow-up"],
  ["06", "An AI assistant for routine work", "Give it approved company information and ask it to prepare a quote or reply. Your team checks the result before sending it.", "Let your team spend more time with customers"],
  ["07", "A weekly business report", "Bring your sales and delivery numbers into one view. See which jobs need attention without rebuilding the same spreadsheet before every meeting.", "Know where the week stands"],
  ["08", "A tool you could sell", "Clients keep asking for the same fix. Build a first version you can show them, then offer to set it up for their businesses.", "Turn a repeated request into a service"],
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
        <p className="md-hero__lede">Every month, the software bill arrives. Every week, your team still works around the feature it does not have. Bring that missing piece to MoreDone and build a first version you can test in seven days, even if you have never written code.</p>
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
      <div><strong>Have a business?</strong><p>Build a tool for the work your team keeps repeating, from customer follow-up to bookings.</p></div>
      <div><strong>Joining on your own?</strong><p>Learn to make websites and useful tools you can use at work or offer to clients. You only need one idea to start.</p></div>
    </div></section>

    <section className="md-numbers" aria-labelledby="md-cost-title"><div className="md-shell">
      <div className="md-heading"><p>THE OPPORTUNITY</p><h2 id="md-cost-title">Turn a repeated job into a tool your team owns.</h2><span>New enquiries, booking changes and weekly reports keep taking your team’s time. Choose one job and build a first version that handles it in seven days.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>{country === "ng" ? "₦250k" : country === "rw" ? "RWF 500k" : "$500"} <em>/ month</em></strong><span>× 12</span><strong>{country === "ng" ? "₦3m" : country === "rw" ? "RWF 6m" : "$6k"} <em>/ year</em></strong></div><p>{country === "ng" ? "A ₦250,000 monthly hire adds ₦3 million in annual salary." : country === "rw" ? "A RWF 500,000 monthly hire adds RWF 6 million in annual salary." : "A $500 monthly support role adds $6,000 in annual pay."} In the challenge, build a tool for one repeated task that often fills a new hire’s day, such as tracking follow-ups or preparing updates. Your team stays in charge of the customer and the final decision.</p></div>
        <div className="md-software"><small>Before another subscription</small><h3>Your CRM should handle the way you sell.</h3><p>Every new seat raises the bill, while your team still works around the feature it needs. Build a first version that records new leads and tells the right person when a reply is due. Put that working flow beside your current CRM and decide which paid features still earn their place.</p><div className="md-software__example"><strong>Put a number on the opportunity</strong><span>Pipedrive Growth is $39 per seat each month and Asana Advanced is $24.99, both billed annually. For 15 people on each, that is <b>$11,518 a year</b>. For perspective, 15% of that bill is <b>$1,728 a year</b>. Bring your own bills and build around the work your team actually does.</span><small><a href="https://www.pipedrive.com/en/pricing" target="_blank" rel="noopener noreferrer">Pipedrive pricing</a> · <a href="https://asana.com/pricing" target="_blank" rel="noopener noreferrer">Asana pricing</a></small></div></div>
      </div>
    </div></section>

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>WHAT COULD YOU BUILD?</p><h2 id="md-projects-title">See your problem. Then build for it.</h2><span>Choose the example closest to your business or bring a different idea. You will build one focused first version during the challenge.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><div className="md-website"><div><span>FOR WEBSITES AND INTERNAL TOOLS</span><h3>Make something you are proud to put your name on.</h3></div><p>A working tool can still feel like a stranger built it. We will help you make it look and sound like your business, test it on a phone, and check how it handles customer details. When AI gives you a generic result, you will know what to change before you share it.</p></div><a className="md-underlink" href="#join">Join the cohort and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">HOW THE WEEK WORKS</p><h2 id="md-days-title">Leave with a working first version.</h2><p>Join two live 90-minute workshops and work on your build each day. We will help you get the main feature working, then use a real example to test it. When you are away from your desk, we will show you how to give your AI tool instructions and check its work from your phone.</p><p className="md-days__tools">You will need a paid AI building tool for the week. It is separate from the challenge fee. After joining, we will show you the options and how to set one up.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">A CHANCE TO LEARN A NEW AD CHANNEL EARLY</p><h2 id="md-ads-title">ChatGPT Ads is growing. Learn how to use it while it is new.</h2><p>Businesses that learned Facebook Ads early had time to test what brought customers to them. ChatGPT Ads offers another chance to learn a growing channel. In October 2026, it reached 89 countries, and more than 100,000 advertisers had used it. More than 1.2 billion people use ChatGPT each week.</p><p>We will help you prepare an offer, an ad and the page people visit after clicking. You will leave with a way to record enquiries and see which become customers. Where ChatGPT Ads is available to your business, you will know how to submit your first test.</p><p className="md-ads__source"><a href="https://openai.com/index/chatgpt-ads-expands-26-new-countries/" target="_blank" rel="noopener noreferrer">See the ChatGPT Ads announcement ↗</a> · <a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check country access ↗</a></p></div><div className="md-ads__graphic" aria-label="From a clear offer to an ad, enquiry and sale"><span>YOUR OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>SALE</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Come alone. Or get your team building together.</h2><span>Everyone gets the same workshops, exercises and guidance. Team places cost less per person.</span></div><div className={`md-pricing__grid${isNigeria ? "" : " md-pricing__grid--four"}`}>{offers.map(({ seats, note }) => <article key={seats} className={seats > 1 ? "md-pricing__team" : undefined} id={seats === 3 ? "team-offer" : undefined}><span>{moreDonePlans[seats].label}{seats > 1 ? ` · save ${savings(seats)}` : ""}</span><h3>{amount(seats)}</h3><p>{note}</p><a href={`?seats=${seats}&country=${country}#join`}>Choose {moreDonePlans[seats].label.toLowerCase()} ↗</a></article>)}</div><p className="md-pricing__fine">Prices are shown for {country === "ng" ? "Nigeria" : country === "rw" ? "Rwanda" : "Global"}. <a href="#md-country">Change country ↑</a> A paid AI building tool, hosting and ad spend are separate where needed; we explain your options before you use them.</p></div></section>
    <section className="md-faq" aria-labelledby="md-faq-title"><div className="md-shell md-faq__layout"><h2 id="md-faq-title">Questions before you join</h2><div className="md-faq__list"><details><summary>Can I get a refund?</summary><p>Yes. Before the challenge starts, we agree on the first tool you will build and how to test it in your business. Attend the classes and complete the exercises. If you follow the guidance and your tool still fails that agreed test, we will give you another guided session at no cost. If it still fails, we will refund your challenge fee.</p></details><details><summary>Do I need to know how to code?</summary><p>No. Bring a business problem or an idea for a client. We will guide you through building a first working version with AI.</p></details></div></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">JOIN MOREDONE</p><h2 id="md-join-title">Your first working version starts here.</h2><p>Choose your places and tell us which job your tool should handle. {isNigeria ? "Pay securely online to join the challenge." : "Send your details to get payment instructions and secure your place."}</p></div><MoreDoneForm country={country} /></div></section>
  </div>;
}
