import { comparison, reasons } from "@/content/site";

export function Ownership() {
  return (
    <>
      <section className="section ownership" id="why-run-rentless" aria-labelledby="ownership-title">
        <div className="shell ownership__layout">
          <div className="ownership__sticky">
            <p className="eyebrow"><span /> Why Run Rentless</p>
            <h2 id="ownership-title">Software that feels closer to an asset.</h2>
            <p>You get a complete working system, a private place for your data, and a clearer path after launch.</p>
          </div>
          <ol className="reasons-list">
            {reasons.map((reason, index) => (
              <li key={reason}><span>{String(index + 1).padStart(2, "0")}</span><p>{reason}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section hosting" aria-labelledby="hosting-title">
        <div className="shell hosting__grid">
          <div className="hosting__number"><strong>24</strong><span>months of hosting included<br />with eligible packages</span></div>
          <div className="hosting__copy">
            <p className="eyebrow"><span /> What happens next</p>
            <h2 id="hosting-title">Your options stay open.</h2>
            <p>After the included period, renew hosting, move to compatible infrastructure, or choose support. You do not repurchase the software merely because included hosting ends.</p>
          </div>
          <div className="hosting__support">
            <span>OPTIONAL SUPPORT</span>
            <p>Choose help with updates, migrations, recovery, or future improvements. The installed version is not disabled solely because support is inactive.</p>
          </div>
        </div>
      </section>

      <section className="section comparison" aria-labelledby="comparison-title">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span /> A clearer comparison</p><h2 id="comparison-title">Renting access vs. preparing your own workspace.</h2></div>
            <p>Run Rentless changes the software cost model while keeping real-world hosting, support, and third-party costs clear.</p>
          </div>
          <div className="comparison-table" role="table" aria-label="Traditional SaaS and Run Rentless comparison">
            <div className="comparison-row comparison-row--header" role="row"><span role="columnheader">The question</span><span role="columnheader">Traditional SaaS</span><span role="columnheader">Run Rentless</span></div>
            {comparison.map(([topic, saas, rentless]) => (
              <div className="comparison-row" role="row" key={topic}>
                <strong role="cell">{topic}</strong><span role="cell">{saas}</span><span role="cell">{rentless}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
