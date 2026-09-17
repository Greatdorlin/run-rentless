import Link from "next/link";

const runPlan = [
  { letter: "R", title: "Retain what works.", text: "Keep the tools your team relies on. Paying for a useful service can still be the right choice." },
  { letter: "U", title: "Upgrade what falls short.", text: "Connect two tools, improve the setup or add a missing feature. You may not need to replace anything." },
  { letter: "N", title: "New options worth exploring.", text: "Compare a different service with a tool built for your business. Check the full cost before you commit." },
];

export function HomeStory() {
  return <>
    <section className="story-problem section">
      <div className="shell story-split">
        <div><p className="eyebrow"><span /> Sound familiar?</p><h2>More tools.<br />More bills.<br />Still doing it by hand?</h2></div>
        <div className="story-signals">
          <article><span>01</span><div><h3>The same work, in three places.</h3><p>A customer fills in a form. Someone copies it into a spreadsheet. Someone else adds it to the sales tool.</p></div></article>
          <article><span>02</span><div><h3>The bill grows with the team.</h3><p>Extra users, contacts and add-ons can turn a small monthly fee into a big running cost.</p></div></article>
          <article><span>03</span><div><h3>The feature you need is still missing.</h3><p>You pay for a long list of features, but your team still chases updates and sends reminders by hand.</p></div></article>
        </div>
      </div>
    </section>

    <section className="story-break"><div className="shell"><p>Your business should not have to work around its tools.</p><Link href="/#audit">Find out what is worth changing <span aria-hidden="true">↗</span></Link></div></section>

    <section className="section story-about" id="about">
      <div className="shell story-split">
        <div><p className="eyebrow"><span /> Meet Run Rentless</p><h2>A clearer bill.<br />Less busywork.<br />Tools that fit.</h2></div>
        <div className="story-copy"><p className="story-lead">Run Rentless helps businesses review the tools they pay for, improve how those tools work together, and build custom business software when it makes sense.</p><p>We start with what you spend and what your team needs. Then we help you keep, improve or replace the right things. You do not need to be technical.</p><Link className="text-link" href="/contact">Already know the problem? Talk to us <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className="audit-principles section" id="how-it-works">
      <div className="shell"><p className="eyebrow"><span /> 01 / Start with the free audit</p><h2>See what your tools really cost.</h2><p className="story-lead">Add any tool, enter your actual bills and tell us what gets in the way. See your monthly, yearly and three-year spend, then get your RUN plan.</p><div className="principle-grid">{runPlan.map((item) => <article key={item.letter}><span>{item.letter}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><div className="story-action"><Link className="button" href="/#audit">Run My Free Audit <span aria-hidden="true">↗</span></Link><p>About 5 minutes. Any tool. No email needed to see your results.</p></div><p className="story-note">The audit gives you a starting point, not a savings promise or a quote to build something new.</p></div>
    </section>

    <section className="section story-example" aria-labelledby="example-heading">
      <div className="shell"><div className="story-split"><div><p className="eyebrow"><span /> Imagine your business</p><h2 id="example-heading">An enquiry comes in.<br />The next step just happens.</h2></div><div className="story-copy"><p>A lead reaches the right person. A reminder goes out. If nobody follows up within 48 hours, it is reassigned. Your manager can see what happened without asking three people.</p><p>That might mean connecting tools you already use. Or building one focused system around your process.</p><small>Illustrative workflow, not a claim about your current tools.</small></div></div><ol className="story-flow" aria-label="Example lead follow-up process"><li><span>01</span>Capture the enquiry</li><li><span>02</span>Assign the right person</li><li><span>03</span>Follow up on time</li><li><span>04</span>See the outcome</li></ol></div>
    </section>

    <section className="audit-next section" id="assessment">
      <div className="shell story-split"><div><p className="eyebrow"><span /> 02 / Check the case for change</p><h2>Know the full cost.<br />Then decide.</h2><Link className="button" href="/contact">Talk Through My Results <span aria-hidden="true">↗</span></Link></div><div className="story-copy"><h3>The Software Ownership Assessment</h3><p>Our paid assessment looks closely at one business process: what your team does, the features it needs, the data to move and the connections to keep.</p><p>We compare the cost of keeping your current tools with changing them, including the build, moving your data, hosting and ongoing support.</p><p><strong>You get a recommendation, a defined scope and a cost breakdown before choosing a build.</strong> The assessment scope and price are agreed before it starts.</p></div></div>
    </section>

    <section className="company-paths section" id="for-companies"><div className="shell"><p className="eyebrow"><span /> 03 / Make the right change</p><h2>Your team builds with us.<br />Or we build for you.</h2><div className="path-grid"><article><span>Done with you</span><h3>Build it with us.</h3><p>Bring someone from your team. We work together on the tools your business needs, with guidance through the build and launch.</p><Link className="text-link" href="/contact">Explore building with us <span aria-hidden="true">↗</span></Link></article><article><span>Done for you</span><h3>Leave the build to us.</h3><p>No time or capacity to build? We handle the agreed work, help your team get started and offer optional ongoing care.</p><Link className="text-link" href="/contact">Discuss a done-for-you build <span aria-hidden="true">↗</span></Link></article></div><p className="story-note">Each project has its own scope and price. Hosting, third-party services, maintenance and future changes can carry ongoing costs.</p></div></section>

    <section className="section story-product" id="leads-desk"><div className="shell story-split"><div><p className="eyebrow"><span /> Already know you need lead management?</p><h2>Meet Leads Desk.</h2></div><div className="story-copy"><p className="story-lead">A ready-made lead management system, set up privately for your business.</p><p>Keep enquiries, assignments, follow-ups and sales progress in one workspace, without compulsory per-user software rent.</p><Link className="text-link" href="/contact">Ask about Leads Desk <span aria-hidden="true">↗</span></Link></div></div></section>

    <section className="section story-questions"><div className="shell story-split"><div><p className="eyebrow"><span /> Before you start</p><h2>A few straight answers.</h2></div><div>
      <details><summary>Will you tell me to replace everything?</summary><p>No. A good tool can be worth paying for. We look at the problem and the full cost before recommending a change.</p></details>
      <details><summary>Can I audit a tool that is not listed?</summary><p>Yes. Add its name and category yourself. We use your bills, not assumed public prices.</p></details>
      <details><summary>Do I need a technical team?</summary><p>No. Start with the tools you use and the problems you want solved. Choose a done-for-you build if your team cannot take it on.</p></details>
      <details><summary>Does owning a tool mean no ongoing costs?</summary><p>No. A custom system can still need hosting, maintenance, updates and paid services. We include those costs in the assessment instead of promising free software forever.</p></details>
    </div></div></section>

    <section className="story-break story-break--final"><div className="shell"><p>Before you pay for another tool,<br />understand the ones you have.</p><Link className="button button--dark" href="/#audit">Run My Free Audit <span aria-hidden="true">↗</span></Link></div></section>
  </>;
}
