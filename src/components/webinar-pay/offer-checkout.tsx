"use client";

import { useEffect, useState } from "react";
import { type OfferCurrency, type OfferSeats, webinarOffer } from "@/lib/webinar-offer";

const seats: OfferSeats[] = [1, 2, 5];
const format = (amount: number, currency: OfferCurrency) => new Intl.NumberFormat("en-US", {
  style: "currency", currency, maximumFractionDigits: 0,
}).format(amount / 100);

export function OfferCheckout() {
  const [currency, setCurrency] = useState<OfferCurrency>("NGN");
  const [selected, setSelected] = useState<OfferSeats>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [verification, setVerification] = useState<"checking" | "paid" | "unconfirmed" | null>(null);
  const [reference, setReference] = useState("");

  useEffect(() => {
    const returnedReference = new URLSearchParams(window.location.search).get("reference");
    if (!returnedReference) return;
    queueMicrotask(() => {
      setReference(returnedReference);
      setVerification("checking");
    });
    fetch(`/api/webinar-pay/verify?reference=${encodeURIComponent(returnedReference)}`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { paid: false })
      .then((result: { paid?: boolean }) => setVerification(result.paid ? "paid" : "unconfirmed"))
      .catch(() => setVerification("unconfirmed"));
  }, []);

  async function startCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/webinar-pay/initialize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, currency, seats: selected }),
      });
      const result: { url?: string; error?: string } = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout could not start. Please try again.");
      window.location.assign(result.url);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Checkout could not start. Please try again.");
      setBusy(false);
    }
  }

  if (verification) return <section className="offer-payment-state" aria-live="polite">
    <span className="offer-kicker">YOUR ENROLLMENT</span>
    <h2>{verification === "paid" ? "Payment confirmed." : verification === "checking" ? "Checking your payment." : "We cannot confirm payment yet."}</h2>
    <p>{verification === "paid" ? "Your seat is paid. Keep your payment reference below. We will contact you using the email entered at checkout with the next class details." : verification === "checking" ? "Please wait while we check directly with Paystack." : "If you paid, please do not pay again. Keep your reference and contact us so we can check it."}</p>
    <code>{reference}</code>
    <a href="mailto:info@runrentless.com?subject=AI%20Execution%20Lab%20payment">Contact Run Rentless ↗</a>
  </section>;

  return <div className="offer-checkout" id="checkout">
    <div className="offer-checkout__intro"><span className="offer-kicker">CHOOSE YOUR SEATS</span><h2>Bring your own problem. Build a first version in class.</h2><p>One payment covers everyone in your group. Choose dollars or naira before checkout.</p></div>
    <div className="offer-currency" role="group" aria-label="Payment currency">
      <button type="button" aria-pressed={currency === "USD"} onClick={() => setCurrency("USD")}>Pay in USD</button>
      <button type="button" aria-pressed={currency === "NGN"} onClick={() => setCurrency("NGN")}>Pay in NGN</button>
    </div>
    <div className="offer-tiers" role="group" aria-label="Number of seats">
      {seats.map((count) => <button type="button" key={count} aria-pressed={selected === count} onClick={() => setSelected(count)} className="offer-tier">
        <span className="offer-tier__top">{count === 1 ? "FOR YOURSELF" : count === 2 ? "BRING A TEAMMATE" : "BRING YOUR TEAM"}<span>{count} {count === 1 ? "SEAT" : "SEATS"}</span></span>
        <strong>{format(webinarOffer[currency][count].amount, currency)}</strong>
        <s>{format(webinarOffer[currency][count].before, currency)}</s>
        <small>{count === 1 ? "One person" : `${format(webinarOffer[currency][count].amount / count, currency)} per person`}</small>
      </button>)}
    </div>
    <form onSubmit={startCheckout} className="offer-form">
      <div><label htmlFor="offer-name">Your name</label><input id="offer-name" autoComplete="name" maxLength={100} minLength={2} required value={name} onChange={(event) => setName(event.target.value)} placeholder="Name for the booking" /></div>
      <div><label htmlFor="offer-email">Email for your booking</label><input id="offer-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></div>
      <button className="offer-pay-button" type="submit" disabled={busy}>{busy ? "Opening secure checkout..." : `Pay ${format(webinarOffer[currency][selected].amount, currency)} securely`}<span aria-hidden="true">↗</span></button>
      {message && <p className="offer-error" role="alert">{message} <a href="mailto:info@runrentless.com?subject=AI%20Execution%20Lab%20booking">Contact Run Rentless</a></p>}
      <p className="offer-form__note">Payment is handled by Paystack. We never see your card details. By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  </div>;
}
