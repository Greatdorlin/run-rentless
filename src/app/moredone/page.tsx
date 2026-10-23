import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { isMoreDoneSeats, moreDonePlans, moreDonePrice, moreDoneCohortDates, type MoreDoneCountry, type MoreDoneSeats } from "@/lib/moredone";
import { MoreDoneForm } from "./more-done-form";
import { CountrySwitcher } from "./country-switcher";
import { CostScenario } from "./cost-scenario";
import { IdeaPreview } from "./idea-preview";
import { PlanChoice } from "./plan-choice";
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
  ["09", "An online shop", "Take orders and keep track of what needs packing and delivery.", "Sell your products online"],
  ["10", "A stock manager", "See what is selling and get a reminder before popular items run out.", "Stay ahead of restocking"],
  ["11", "A quote builder", "Choose the items a customer needs and prepare a quote ready for your review.", "Reply while the customer is interested"],
  ["12", "A course or member portal", "Give members one place to find lessons, resources and announcements.", "Share what you know"],
  ["13", "An event check-in tool", "Keep a guest list and record arrivals from a phone at the door.", "Make arrivals easier to manage"],
  ["14", "A client approval portal", "Let clients review work, leave feedback and approve the next step.", "Keep projects moving"],
];
const days = [
  ["01", "Choose the job", "Bring the customer, team or sales task you want your tool to handle."],
  ["02", "Map how it should work", "Decide what goes in, what happens next and what a good result looks like."],
  ["03–05", "Build your first version", "Make the main feature work, then try it with an example from your business."],
  ["06", "Plan how to find customers", "Prepare an offer, a page and a way to track enquiries from your ads."],
  ["07", "Show the working tool", "Run the agreed test and leave with a clear next step for using or improving it."],
];

export default async function MoreDonePage({ searchParams }: { searchParams: Promise<{ country?: string; region?: string; seats?: string }> }) {
  const requested = await searchParams;
  const detected = (await headers()).get("x-vercel-ip-country")?.toUpperCase();
  const country: MoreDoneCountry = requested.country === "ng" || requested.country === "rw" || requested.country === "other"
    ? requested.country
    : requested.region === "ng" ? "ng" : requested.region === "international" ? "other"
    : detected === "NG" ? "ng" : detected === "RW" ? "rw" : "other";
  const isNigeria = country === "ng";
  const requestedSeats = Number(requested.seats);
  const initialSeats = isMoreDoneSeats(requestedSeats) && (!isNigeria || requestedSeats !== 2) ? requestedSeats : 1;
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
      <div className="md-hero__top"><p className="md-brandline">Run Rentless <span>×</span> Navrademy</p><CountrySwitcher country={country} /></div>
      <div className="md-hero__copy">
        <p className="md-program">MoreDone: The 7-Day AI Business Challenge</p>
        <h1 id="md-title">Build the tool your business keeps wishing it had.</h1>
        <p className="md-hero__lede">Spend seven days building something you can use: a website that takes orders, an app that tracks customers, or a tool that saves you hours of repeat work. We teach you how to build it with AI, even if you have never written code.</p>
        <p className="md-cohort-date">Next cohort: <strong>{moreDoneCohortDates}</strong><span>Live online · Workshop times sent by email</span></p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Join the cohort <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you could build ↓</a></div>
        <p className="md-hero__micro">Bringing your team? <a href="#team-offer">See the team offer ↗</a></p>
      </div>
      <div className="md-hero__visual" aria-label="Examples of what you can build and learn in MoreDone">
        <div className="md-build-stack">
          <article className="md-build-card"><h2>Your own CRM</h2><p>Know who is ready to buy and who needs a follow-up.</p></article>
          <article className="md-build-card"><h2>Stock manager</h2><p>See what is running low before a customer asks.</p></article>
          <article className="md-build-card"><h2>Business website</h2><p>Give customers a reason to trust you and a way to buy.</p></article>
          <article className="md-build-card"><h2>Booking app</h2><p>Let customers choose a time without a string of messages.</p></article>
          <article className="md-build-card"><h2>Client portal</h2><p>Let clients find their files and check progress without calling.</p></article>
          <article className="md-build-card"><h2>AI assistant</h2><p>Turn your business information into a draft quote or reply.</p></article>
        </div>
        <div className="md-build-ads"><h2>Learn ChatGPT Ads</h2><p>Learn how to put your offer in front of people exploring what to buy.</p></div>
      </div>
    </div></section>

    <div className="md-sticky-cta"><a href="#join">Join the cohort <span aria-hidden="true">↗</span></a></div>
    <section className="md-for" aria-label="Who can join MoreDone"><div className="md-shell md-for__grid">
      <div><strong>Run a business?</strong><p>Build the customer tracker, booking app or website your business needs. Start with one job you want to make easier.</p></div>
      <div><strong>Joining on your own?</strong><p>Build a tool for your work or a client. You will learn a skill you can keep using after the challenge.</p></div>
    </div></section>

    <IdeaPreview />
    <section className="md-teacher" aria-label="Your instructor"><div className="md-shell md-teacher__inner"><Image className="md-teacher__portrait" src="/gd-moredone.png" width={160} height={160} sizes="(max-width: 680px) 88px, 120px" alt="Greatdorlin Wisdom (GD), founder of Run Rentless" /><div><h2>Learn with GD, founder of Run Rentless.</h2><p>GD builds AI systems for businesses and will guide you through building your own. Try the <Link href="/#audit">Run Rentless tool audit</Link> to see one of the tools behind the business.</p></div></div></section>
    <section className="md-numbers" aria-labelledby="md-cost-title"><div className="md-shell">
      <div className="md-heading"><h2 id="md-cost-title">That idea you keep putting off? Build it with us.</h2><span>Your shop needs a stock tracker. A client needs a website. You spend every Friday putting the same report together. Bring one problem and leave with a first version you can use and improve.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>{country === "ng" ? "₦250k" : country === "rw" ? "RWF 500k" : "$500"} <em>/ month</em></strong><span>× 12</span><strong>{country === "ng" ? "₦3m" : country === "rw" ? "RWF 6m" : "$6k"} <em>/ year</em></strong></div><p>{country === "ng" ? "A ₦250,000 monthly salary adds ₦3 million a year." : country === "rw" ? "A RWF 500,000 monthly salary adds RWF 6 million a year." : "A $500 monthly salary adds $6,000 a year."} Before hiring someone to handle repeat work, build a tool for one part of that job, such as tracking customer replies or preparing weekly updates. If you work alone, this is also a problem you can learn to solve for clients.</p></div>
        <div className="md-software"><CostScenario key={country} country={country} /></div>
      </div>
    </div></section>

    <section className="md-projects" aria-labelledby="md-projects-title"><div className="md-shell" id="projects"><div className="md-heading"><h2 id="md-projects-title">What have you always wanted to build?</h2><span>Bring the idea you keep coming back to. These examples are a starting point. We will help you choose the part to build and test in seven days.</span></div><div className="md-projects__grid md-projects__grid--compact">{projects.slice(0, 6).map(([number, title, detail]) => <article className="md-project" key={number}><h3>{title}</h3><p>{detail}</p></article>)}</div><details className="md-projects__more"><summary>Explore {projects.length - 6} more project ideas</summary><div className="md-projects__grid md-projects__grid--compact">{projects.slice(6).map(([number, title, detail]) => <article className="md-project" key={number}><h3>{title}</h3><p>{detail}</p></article>)}</div></details><div className="md-website"><div><span>FOR WEBSITES AND INTERNAL TOOLS</span><h3>Make something you are proud to put your name on.</h3></div><p>We will help you make your tool look and sound like the business it serves. You will check it on a phone and learn how to protect customer details before sharing it. You can change an AI-generated design that feels generic.</p></div><a className="md-underlink" href="#join">Join the cohort and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><h2 id="md-days-title">Bring your idea. Follow the lessons. Build it during the week.</h2><p>Your place includes two live 90-minute workshops, daily building exercises, starter templates, group guidance and a final review. You work on one project throughout the seven days, with help as you build.</p><p>A first version does one useful job from start to finish. For a booking app, that means someone chooses a time and the booking appears in your schedule. We agree on your project’s main job before you begin and test it together at the end.</p><p className="md-days__tools">Bring a laptop and access to a paid AI building tool. Its subscription is separate from your place. We help you choose the tool before the first workshop, and explain any hosting your project needs before you use it.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">A CHANCE TO LEARN A NEW AD CHANNEL EARLY</p><h2 id="md-ads-title">ChatGPT Ads is growing. Learn how to use it while it is new.</h2><p>Businesses that learned Facebook Ads early had time to test what brought customers to them. ChatGPT Ads offers another chance to learn a growing channel. In October 2026, it reached 89 countries, and more than 100,000 advertisers had used it. More than 1.2 billion people use ChatGPT each week.</p><p>We will help you prepare an offer, an ad and the page people visit after clicking. You will leave with a way to record enquiries and see which become customers. Where ChatGPT Ads is available to your business, you will know how to submit your first test.</p><p className="md-ads__source"><a href="https://openai.com/index/chatgpt-ads-expands-26-new-countries/" target="_blank" rel="noopener noreferrer">See the ChatGPT Ads announcement ↗</a> · <a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check country access ↗</a></p></div><div className="md-ads__graphic" aria-label="From a clear offer to an ad, enquiry and sale"><span>YOUR OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>SALE</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell" id="team-offer"><div className="md-heading"><h2 id="md-pricing-title">How many people are joining?</h2><span>Every place includes both live workshops, daily exercises, help with your build and the ChatGPT Ads lesson.</span></div><div className="md-price-list">{offers.map(({ seats }) => <PlanChoice key={seats} seats={seats} country={country}><span className="md-price-row__people">{seats === 1 ? "Just me" : `${seats} people`}<small>{seats === 1 ? "One place" : "Team package"}</small></span><span className="md-price-row__total">{amount(seats)}<small>Total for {seats === 1 ? "one person" : `all ${seats} people`}</small></span><span className="md-price-row__saving">{seats > 1 ? `Save ${savings(seats)}` : "Individual price"}</span><span className="md-price-row__action">Choose <span aria-hidden="true">↗</span></span></PlanChoice>)}</div><p className="md-pricing__fine">Team savings compared with buying individual places. Prices shown for {country === "ng" ? "Nigeria" : country === "rw" ? "Rwanda" : "Global"}. <a href="#md-country">Change country ↑</a></p><p className="md-pricing__fine">A paid AI building tool, hosting and ad spend are separate where needed. We explain these before you use them.</p></div></section>
    <section className="md-faq" aria-labelledby="md-faq-title"><div className="md-shell md-faq__layout"><h2 id="md-faq-title">Questions before you join</h2><div className="md-faq__list"><details><summary>Can I get a refund?</summary><p>Yes. Before you begin, we agree on what your first tool will do and the test it must pass. Attend the classes and complete the exercises. If the tool fails that test after you follow the guidance, we give you another guided session free. If it still fails, we refund your challenge fee.</p></details><details><summary>Can I join without a business or coding experience?</summary><p>Yes. You can build something for your job, a client or an idea of your own. We show you how to give AI instructions, make changes and check that your tool works.</p></details><details><summary>What do I finish with?</summary><p>One first version that completes the job we agreed on, plus a review of how it works and what to improve next. Choose a project such as a customer tracker, booking app or website. Larger ideas begin with one main feature.</p></details><details><summary>Can I see something built by Run Rentless?</summary><p>Try our <Link href="/#audit">free tool audit</Link> to add tools and see your costs, or explore the <Link href="/webinar">webinar registration page</Link>. They show the kinds of forms, reports and customer journeys you can learn to build.</p></details><details><summary>Can I run ChatGPT Ads from my country?</summary><p>The lesson covers your offer, ad and customer enquiry page. Submitting an ad requires access to ChatGPT Ads in your market. <a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check current availability</a> before budgeting for a campaign. Advertising spend is separate.</p></details></div></div></section>
    <section className="md-join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout" id="join"><div><h2 id="md-join-title">Join the cohort. Bring your idea.</h2><p className="md-cohort-date"><strong>{moreDoneCohortDates}</strong><span>Live online with GD · Workshop times and joining links sent by email</span></p><p>Choose your places below. {isNigeria ? "Complete your payment to join." : "Continue to our payment team on WhatsApp to complete your registration."}</p></div><MoreDoneForm country={country} initialSeats={initialSeats} /></div></section>
  </div>;
}
