"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Run Rentless page error", error);
  }, [error]);

  return (
    <section className="not-found shell" role="alert">
      <p className="eyebrow"><span /> Something went wrong</p>
      <h1>We couldn&apos;t load this page.</h1>
      <p>Please try again. If it keeps happening, contact us and include the reference below.</p>
      {error.digest && <p>Reference: {error.digest}</p>}
      <div className="page-error__actions">
        <button className="button" type="button" onClick={reset}>Try again <span aria-hidden="true">↗</span></button>
        <Link className="text-link" href="/">Go home <span aria-hidden="true">↗</span></Link>
        <Link className="text-link" href="/contact">Contact us <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
