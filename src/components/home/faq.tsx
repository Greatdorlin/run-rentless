import Link from "next/link";
import { faqs } from "@/content/site";

export function FAQ() {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="shell faq__layout">
        <div className="faq__intro">
          <p className="eyebrow"><span /> Plain answers</p>
          <h2 id="faq-title">Questions worth asking before you change the cost model.</h2>
          <p>Still deciding what fits? <Link href="/contact">Start with a simple conversation.</Link></p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} name="run-rentless-faq">
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
