import type { Metadata } from "next";
import { MoreDoneForm } from "./more-done-form";
import "./moredone.css";

export const metadata: Metadata = {
  title: "MoreDone: The 7-Day AI Business Challenge",
  description: "Build and test a useful business tool in seven days with Run Rentless and Navrademy. Join MoreDone on your own or bring a team of three or five.",
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
  ["06", "Plan how to find customers", "Learn ChatGPT Ads, prepare an offer and decide how you would measure results."],
  ["07", "Test and show your tool", "Demonstrate what works, fix what does not and decide what to build next."],
];

export default function MoreDonePage() {
  return <div className="md-page">
    <section className="md-hero" aria-labelledby="md-title"><div className="md-shell md-hero__grid">
      <div className="md-hero__copy">
        <p className="md-brandline">Run Rentless <span>×</span> Navrademy</p>
        <p className="md-program">MoreDone: The 7-Day AI Business Challenge</p>
        <h1 id="md-title">Build the tool your business keeps wishing it had.</h1>
        <p className="md-hero__lede">In seven days, build and test a customer tracker, website, booking system or another tool you actually need. We guide you, even if you have never coded. You can also learn to build for clients.</p>
        <div className="md-hero__actions"><a className="md-button" href="#join">Join the cohort <span aria-hidden="true">↗</span></a><a className="md-text-link" href="#projects">See what you could build ↓</a></div>
        <p className="md-hero__micro">Bringing your team? <a href="#team-offer">See the team offer ↗</a></p>
      </div>
      <div className="md-hero__visual" aria-label="Illustrative customer follow-up project">
        <div className="md-visual__top"><span>ONE POSSIBLE BUILD</span><span className="md-status"><i /> Customer enquiries</span></div>
        <div className="md-visual__body"><div className="md-visual__head"><span>Sales follow-up</span><strong>Every enquiry has a next step.</strong></div>
          <div className="md-visual__flow"><div><span>Customer</span><strong>Enquires</strong></div><b>→</b><div><span>Team</span><strong>Gets owner</strong></div><b>→</b><div><span>Follow-up</span><strong>Gets reminder</strong></div></div>
          <div className="md-visual__row"><span>New request</span><span>Assigned to Timi</span></div><div className="md-visual__row"><span>Quote sent</span><span>Check back tomorrow</span></div>
        </div><p>Example only. Your first build starts with a problem you choose.</p>
      </div>
    </div></section>

    <div className="md-sticky-cta"><a href="#join">Join the cohort <span aria-hidden="true">↗</span></a></div>
    <section className="md-for" aria-label="Who can join MoreDone"><div className="md-shell md-for__grid">
      <div><strong>Have a business?</strong><p>Build a tool for the work your team keeps repeating, from customer follow-up to bookings.</p></div>
      <div><strong>Joining on your own?</strong><p>Learn to make websites and useful tools you can use at work or offer to clients. You only need one idea to start.</p></div>
    </div></section>

    <section className="md-numbers" aria-labelledby="md-cost-title"><div className="md-shell">
      <div className="md-heading"><p>THE OPPORTUNITY</p><h2 id="md-cost-title">Your next hire or software bill can wait until you check this.</h2><span>Pick the work taking up your team’s time. We will help you build a tool for it and test whether it can reduce the cost.</span></div>
      <div className="md-numbers__grid">
        <div className="md-salary"><small>Before another hire</small><div className="md-salary__sum"><strong>₦250k <em>/ month</em></strong><span>× 12</span><strong>₦3m <em>/ year</em></strong></div><p>A ₦250,000 monthly hire adds ₦3 million in annual salary. If AI helps your current team handle the extra follow-ups, reports or record updates, you could delay that hire and use the money elsewhere.</p></div>
        <div className="md-software"><small>Before another subscription</small><h3>What does the tool do for you?</h3><p>Your business might pay for sales, bookings and team tasks in separate tools, while staff still copy customer details between them. We will show you how to build the steps you need in one place and compare the cost with your current bills.</p><div className="md-software__example"><strong>A real price example</strong><span>At published annual prices, 15 seats on Pipedrive Growth and Asana Advanced cost about <b>$11,518 a year</b>. Cutting 15% of that bill would free up about <b>$1,728 a year</b>. We will help you check whether a new tool would cost less to build and run before you change anything.</span><small><a href="https://www.pipedrive.com/en/pricing/professional-crm" target="_blank" rel="noopener noreferrer">Pipedrive pricing</a> · <a href="https://asana.com/pricing" target="_blank" rel="noopener noreferrer">Asana pricing</a></small></div></div>
      </div>
    </div></section>

    <section className="md-projects" id="projects" aria-labelledby="md-projects-title"><div className="md-shell"><div className="md-heading"><p>WHAT COULD YOU BUILD?</p><h2 id="md-projects-title">Build a tool you can put to work.</h2><span>Choose an idea below or bring your own. During the challenge, you will make one starter tool and test it on a real task.</span></div><div className="md-projects__grid">{projects.map(([number, title, detail, output]) => <article className="md-project" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{output}</small></article>)}</div><div className="md-website"><div><span>BUILDING A WEBSITE?</span><h3>Make it look like your business.</h3></div><p>We will show you how to plan a website or landing page, guide AI toward a design that fits your brand, write clear words and check the result on a phone. You will also learn basic security checks for forms and customer details before publishing.</p></div><a className="md-underlink" href="#join">Join the cohort and tell us your idea ↗</a></div></section>

    <section className="md-days" aria-labelledby="md-days-title"><div className="md-shell md-days__layout"><div><p className="md-section-kicker">HOW THE WEEK WORKS</p><h2 id="md-days-title">Seven days. One useful first build.</h2><p>Join two live 90-minute workshops. Each day you get a small task, examples to work from and help when you get stuck. You will test one starter project on a real job, not just watch a demonstration.</p><p className="md-days__tools">You will need a paid AI building tool for the week. It is separate from the challenge fee. After joining, we will show you the options and how to set one up.</p></div><ol>{days.map(([day, title, detail]) => <li key={day}><span>DAY {day}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></div></section>

    <section className="md-ads" aria-labelledby="md-ads-title"><div className="md-shell md-ads__layout"><div><p className="md-section-kicker">A NEW WAY TO REACH CUSTOMERS</p><h2 id="md-ads-title">Prepare your first ChatGPT Ads campaign.</h2><p>People use ChatGPT to compare products and services. As ads become available in more countries, businesses have another place to reach buyers while they are making a decision.</p><p>We will help you choose an offer, write an ad and prepare the page people will visit. You will learn how to track enquiries and sales so you can judge the result. If your business has access, you can submit a campaign for approval. Ad spend is your choice and is separate from the challenge fee.</p><p className="md-ads__source"><a href="https://openai.com/index/chatgpt-ads-expands-26-new-countries/" target="_blank" rel="noopener noreferrer">About the ChatGPT Ads expansion ↗</a> · <a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Check availability ↗</a></p></div><div className="md-ads__graphic" aria-label="From a clear offer to an ad, enquiry and sale"><span>YOUR OFFER</span><i /><span>AD</span><i /><span>ENQUIRY</span><i /><span>SALE</span></div></div></section>

    <section className="md-pricing" aria-labelledby="md-pricing-title"><div className="md-shell"><div className="md-heading"><p>CHOOSE YOUR PLACE</p><h2 id="md-pricing-title">Come alone. Or get your team building together.</h2><span>Everyone gets the same workshops, exercises and guidance. Team places cost less per person.</span></div><div className="md-pricing__grid"><article><span>One place</span><h3>₦120,000</h3><p className="md-pricing__usd">$100 international reference</p><p>Bring a problem from work, your own business or a client idea. Build and test your first tool with us.</p><a href="?seats=1#join">Choose one place ↗</a></article><article className="md-pricing__team" id="team-offer"><span>Three places · save ₦60,000</span><h3>₦300,000</h3><p className="md-pricing__usd">$250 international reference</p><p>₦100,000 per person. Bring two colleagues to work on one business problem together.</p><a href="?seats=3#join">Choose three places ↗</a></article><article className="md-pricing__team"><span>Five places · save ₦150,000</span><h3>₦450,000</h3><p className="md-pricing__usd">$375 international reference</p><p>₦90,000 per person. Give more of your team the skill to build and improve the tools they use.</p><a href="?seats=5#join">Choose five places ↗</a></article></div><p className="md-pricing__fine">Paystack charges in naira. If you use an international card, your bank sets the conversion rate, so the dollar figures are a guide. A paid AI building tool, hosting and ad spend are separate where needed; we explain your options before you use them.</p></div></section>
    <section className="md-guarantee"><div className="md-shell md-guarantee__layout"><strong>What if my tool does not work?</strong><p>Before the challenge, we agree on one small tool and what it needs to do. Come to the required sessions and finish the exercises. If your tool does not pass that test, we will help you again in an extra session for free. If our promised help still does not get it working as agreed, we will refund your challenge fee.</p></div></section>
    <section className="md-join" id="join" aria-labelledby="md-join-title"><div className="md-shell md-join__layout"><div><p className="md-section-kicker">JOIN MOREDONE</p><h2 id="md-join-title">Start with the problem you want to solve.</h2><p>Choose one, three or five places. Tell us what you would like to build, then pay securely with Paystack. We will email your confirmation and help you get ready.</p></div><MoreDoneForm /></div></section>
  </div>;
}
