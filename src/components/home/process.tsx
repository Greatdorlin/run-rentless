import { processSteps } from "@/content/site";

export function Process() {
  return (
    <section className="section process" id="how-it-works" aria-labelledby="process-title">
      <div className="shell">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> How it works</p>
            <h2 id="process-title">Choose your software. We prepare it for your team.</h2>
          </div>
          <p>The system is already built. We set up a dedicated version for your organisation, check it with you, and help your team start using it.</p>
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
