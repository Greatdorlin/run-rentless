import { differences } from "@/content/site";

export function Difference() {
  return (
    <section className="section difference" aria-labelledby="difference-title">
      <div className="shell">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> A simpler way to buy software</p>
            <h2 id="difference-title">Grow your team without growing a per-user software bill.</h2>
          </div>
          <p>
            Choose a ready-made system. We prepare and deploy it for your organisation for an agreed implementation price.
          </p>
        </div>
        <div className="difference-list">
          {differences.map((item) => (
            <article key={item.number} className="difference-item">
              <span className="difference-item__number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
