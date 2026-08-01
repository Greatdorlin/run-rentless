import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found shell">
      <p className="eyebrow"><span /> 404 · no rent due here</p>
      <h1>This page moved out without leaving a forwarding address.</h1>
      <p>The useful part of Run Rentless is still exactly where it should be.</p>
      <Link className="button" href="/">Return home <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
