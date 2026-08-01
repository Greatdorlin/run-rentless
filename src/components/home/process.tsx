import { processSteps } from "@/content/site";

export function Process() {
  return (
    <section className="section process" id="how-it-works" aria-labelledby="process-title">
      <div className="shell">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> How it works</p>
            <h2 id="process-title">From decision to daily use, without the technical maze.</h2>
          </div>
          <p>You tell us how the work should flow. We handle the preparation and help your team arrive at a confident launch.</p>
        </div>
        <ol className="process-list">
          {processSteps.map(([title, body], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
