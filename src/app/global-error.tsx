"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", padding: "clamp(24px, 8vw, 96px)", background: "#031e19", color: "#fdfff4", fontFamily: "Arial, sans-serif" }}>
        <main role="alert" style={{ maxWidth: 680, paddingTop: "15vh" }}>
          <p style={{ color: "#c6ff00", fontWeight: 700 }}>RUN RENTLESS</p>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 1.05 }}>We couldn&apos;t load the site.</h1>
          <p>Please try again. If it keeps happening, contact us and include the reference below.</p>
          {error.digest && <p>Reference: {error.digest}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 32 }}>
            <button type="button" onClick={reset} style={{ padding: "15px 24px", border: 0, background: "#c6ff00", color: "#031e19", fontWeight: 700, cursor: "pointer" }}>Try again</button>
            <Link href="/" style={{ color: "#fdfff4" }}>Go home</Link>
            <Link href="/contact" style={{ color: "#fdfff4" }}>Contact us</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
