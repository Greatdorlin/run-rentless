import { differences } from "@/content/site";

export function Difference() {
  return (
    <section className="section difference" aria-labelledby="difference-title">
      <div className="shell">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> A different cost curve</p>
            <h2 id="difference-title">Growth should add opportunity—not automatic software rent.</h2>
          </div>
          <p>
            Instead of renting seats indefinitely, purchase a complete deployment that is prepared around your organisation and ready for your team.
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
