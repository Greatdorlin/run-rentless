import Link from "next/link";

const runPlan = [
  { letter: "R", title: "Retain what works.", text: "Keep paying for a tool if it does the job well. We do not recommend replacing things just to sell you a build." },
  { letter: "U", title: "Upgrade the tools you have.", text: "Make your existing tools share information or add the feature your team needs." },
  { letter: "N", title: "New tools, built for you.", text: "If your tools keep getting in the way, compare another service with a tool built around how your team works." },
];

export function HomeStory() {
  return <>
    <section className="story-problem section">
      <div className="shell story-split">
        <div><p className="eyebrow"><span /> Sound familiar?</p><h2>You pay for the tools.<br />Why is the work<br />still so difficult?</h2></div>
        <div className="story-signals">
          <article><span>01</span><div><h3>Your team enters the same details twice.</h3><p>A customer sends an enquiry. Your team copies their name, number and request from one tool to another because the tools do not share information.</p></div></article>
          <article><span>02</span><div><h3>You hire someone. Your bill goes up.</h3><p>Some tools charge for every person who uses them. Others charge more as you add customers or send more emails. Your bill can grow even when the work stays the same.</p></div></article>
          <article><span>03</span><div><h3>You still cannot do the one thing you need.</h3><p>You want a reminder when nobody replies to a customer. Your tool does not offer it, so someone has to check the list and chase the team.</p></div></article>
        </div>
      </div>
    </section>

    <section className="story-break"><div className="shell"><p>Your tools should make the work easier. Not create more of it.</p><Link href="/#audit">Find out what is worth changing <span aria-hidden="true">↗</span></Link></div></section>

    <section className="section story-about" id="about">
      <div className="shell story-split">
        <div><p className="eyebrow"><span /> Meet Run Rentless</p><h2>Keep the useful tools.<br />Fix what slows you down.<br />Build what is missing.</h2></div>
        <div className="story-copy"><p className="story-lead">Run Rentless helps you decide which tools to keep, connects the ones that need to work together, and builds tools for the jobs your current ones cannot do.</p><p>Tell us what your team needs to do. We help you find a practical way to do it, with the cost explained before you commit.</p><Link className="text-link" href="/contact">Already know the problem? Talk to us <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className="audit-principles section" id="how-it-works">
      <div className="shell"><p className="eyebrow"><span /> 01 / Start with the free audit</p><h2>Know what to keep.<br />See what needs to change.</h2><p className="story-lead">Add the tools you pay for and tell us what frustrates your team. Get a short plan: which bills to check, which tools may do the same job, and what to improve first.</p><div className="principle-grid">{runPlan.map((item) => <article key={item.letter}><span>{item.letter}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><div className="story-action"><Link className="button" href="/#audit">Check My Tools for Free <span aria-hidden="true">↗</span></Link><p>Start with 1 to 3 tools. Skip what you do not know. See your results before sharing your email.</p></div><p className="story-note">Your answers guide the advice. We check the full cost before recommending a change.</p></div>
    </section>

    <section className="section story-example" aria-labelledby="example-heading">
      <div className="shell">
        <p className="eyebrow"><span /> One example: replying to a new customer</p>
        <h2 id="example-heading">A customer asks for a quote.<br />Make sure someone replies.</h2>
        <div className="story-before-after">
          <article className="story-before"><p className="example-label">Before / Someone has to remember</p><h3>“Has anyone replied to this customer?”</h3><ol><li>An enquiry arrives in the inbox.</li><li>Someone copies it into a spreadsheet.</li><li>A manager asks who is dealing with it.</li><li>The customer is still waiting.</li></ol></article>
          <article className="story-after"><p className="example-label">After / The tool handles the next step</p><h3>Every enquiry has a person responsible.</h3><ol><li><strong>Save the enquiry.</strong><span>The customer’s details go straight into one shared list.</span></li><li><strong>Tell the right person.</strong><span>The person handling it gets a notification.</span></li><li><strong>Remind them to reply.</strong><span>No reply after 48 hours? Send a reminder or pass it to someone else.</span></li><li><strong>See what happened.</strong><span>Your manager sees who replied and which quotes need a follow-up.</span></li></ol></article>
        </div>
        <p className="example-outcome">No copying details. No guessing who is responsible. A clear next step for every enquiry.</p>
        <p className="story-note">An example we could build by connecting your existing tools or creating one tool for the whole job.</p>
      </div>
    </section>

    <section className="section story-control">
      <div className="shell story-split"><div><p className="eyebrow"><span /> More control over your business</p><h2>Your records.<br />Your way of working.</h2></div><div className="story-copy">
        <h3>Keep control of your business data.</h3><p>With a tool built for you, we plan how you access your records, decide who can see them and export them when you need to move.</p>
        <h3>Add the features your team actually needs.</h3><p>Need a different approval step or a new follow-up rule? We can build around your process instead of waiting for a subscription provider to add it for everyone.</p>
        <p>Start with the most useful change. We agree what it will take, the price and the delivery date before work begins.</p>
      </div></div>
    </section>

    <section className="story-assessment section" id="assessment">
      <div className="shell story-split"><div><p className="eyebrow"><span /> 02 / Decide if a change is worth it</p><h2>Know the full cost.<br />Then decide.</h2><Link className="button" href="/contact">Talk Through My Results <span aria-hidden="true">↗</span></Link></div><div className="story-copy"><h3>The Software Ownership Assessment</h3><p>We take one problem, such as missed customer follow-ups, and look at how your team handles it today.</p><p>Then we compare your options: fix the current tool, switch to another one or build your own. We include the cost of moving your records, keeping it online and supporting it.</p><p><strong>You get a recommendation, a clear plan and price before choosing to build.</strong> We agree the review price with you before starting.</p></div></div>
    </section>

    <section className="company-paths section" id="for-companies"><div className="shell"><p className="eyebrow"><span /> 03 / Make the right change</p><h2>Your team builds with us.<br />Or we build for you.</h2><div className="path-grid"><article><span>Done with you</span><h3>Build it with us.</h3><p>Someone from your team builds alongside us. We guide them from the first working version to a tool your team can use.</p><Link className="text-link" href="/contact">Explore building with us <span aria-hidden="true">↗</span></Link></article><article><span>Done for you</span><h3>Leave the build to us.</h3><p>Tell us what you need. We build and test it, move the agreed records and show your team how to use it. Support is available after launch.</p><Link className="text-link" href="/contact">Discuss a done-for-you build <span aria-hidden="true">↗</span></Link></article></div><p className="story-note">We agree the work and price upfront. Keeping your tool online, supporting it and adding features can cost extra.</p></div></section>

    <section className="section story-product" id="leads-desk"><div className="shell story-split"><div><p className="eyebrow"><span /> Need to keep track of customer enquiries?</p><h2>Meet Leads Desk.</h2></div><div className="story-copy"><p className="story-lead">One place to see who has enquired, who should reply and what happens next.</p><p>Leads Desk is set up privately for your business, without a required software fee for every user.</p><Link className="text-link" href="/contact">Ask about Leads Desk <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className="section story-questions"><div className="shell story-split"><div><p className="eyebrow"><span /> Before you start</p><h2>A few straight answers.</h2></div><div>
      <details><summary>Will you tell me to replace everything?</summary><p>No. A good tool can be worth paying for. We look at the problem and the full cost before recommending a change.</p></details>
      <details><summary>What if my tool is not on the list?</summary><p>Add its name and what you use it for. Enter your own bill, not an advertised price.</p></details>
      <details><summary>Do I need a technical team?</summary><p>No. Start with the tools you use and the problems you want solved. Choose a done-for-you build if your team cannot take it on.</p></details>
      <details><summary>Does owning a tool mean no ongoing costs?</summary><p>No. Keeping it online, fixing problems and adding features can cost money. We explain those costs before you decide.</p></details>
    </div></div></section>

    <section className="story-break story-break--final"><div className="shell"><p>Before you pay for another tool,<br />understand the ones you have.</p><Link className="button button--dark" href="/#audit">Check My Tools for Free <span aria-hidden="true">↗</span></Link></div></section>
  </>;
}
