import { moreDonePlans, moreDonePrice, moreDoneCohortDates, type MoreDoneSeats, type MoreDoneCountry } from "@/lib/moredone";

const money = (seats: MoreDoneSeats) => `₦${(moreDonePlans[seats].amount / 100).toLocaleString("en-NG")}`;
const placeLabel = (seats: MoreDoneSeats) => seats === 1 ? "one place" : seats === 2 ? "two places" : seats === 3 ? "three places" : "five places";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);

function layout(firstName: string, title: string, paragraphs: string[], action?: { label: string; url: string }) {
  const safeName = escapeHtml(firstName);
  const content = paragraphs.map((paragraph) => `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(paragraph)}</p>`).join("");
  const button = action ? `<p style="margin:28px 0"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#c6ff00;color:#031e19;padding:15px 22px;font-weight:700;text-decoration:none">${escapeHtml(action.label)}</a></p>` : "";
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f4f5eb;color:#031e19;font-family:Arial,sans-serif"><div style="max-width:580px;margin:0 auto;padding:32px 22px"><div style="background:#031e19;color:#fff;padding:19px 24px;font-weight:700;font-size:20px">RUN <span style="color:#c6ff00">rentless</span></div><div style="background:#fff;padding:30px 24px"><p style="font-size:12px;font-weight:700;letter-spacing:.08em;color:#315b41">MOREDONE · 7-DAY AI BUSINESS CHALLENGE</p><h1 style="font-size:30px;line-height:1.15;margin:18px 0 24px">${escapeHtml(title)}</h1><p style="margin:0 0 16px">Hi ${safeName},</p>${content}${button}<p style="margin:28px 0 0;font-size:13px;color:#426052">Questions? Reply to this email.</p></div></div></body></html>`;
}

async function send(email: string, firstName: string, subject: string, text: string, html: string) {
  const token = process.env.SENDER_API;
  if (!token) throw new Error("Sender configuration missing");
  const response = await fetch("https://api.sender.net/v2/message/send", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(12000),
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      from: { email: process.env.SENDER_FROM_EMAIL || "info@runrentless.com", name: "Run Rentless" },
      to: { email, name: firstName }, subject, text, html, headers: { charset: "utf-8" },
    }),
  });
  if (!response.ok) throw new Error(`Sender message ${response.status}`);
  const result = await response.json() as { success?: boolean; emailId?: string };
  if (!result.success || !result.emailId) throw new Error("Sender did not accept message");
  return result.emailId;
}

export function sendMoreDoneCheckoutLink(email: string, firstName: string, seats: MoreDoneSeats, url: string) {
  const total = money(seats);
  const label = placeLabel(seats);
  const text = `Hi ${firstName},\n\nYou chose ${label} for MoreDone. Your total is ${total}. Your place is not paid yet.\n\nYou can finish your payment here: ${url}\n\nIf you have already paid, do not pay again. Reply to this email and we will check it.\n\nRun Rentless`;
  return send(email, firstName, "Your MoreDone checkout link", text, layout(firstName, "Your checkout link is ready.", [`You chose ${label} for ${total}. Your place is not paid yet.`, "If you need more time, use the link below to finish your payment.", "Already paid? Do not pay again. Reply to this email and we will check it."], { label: "Finish your payment", url }));
}

export function sendMoreDoneCheckoutReminder(email: string, firstName: string, seats: MoreDoneSeats, url: string) {
  const total = money(seats);
  const label = placeLabel(seats);
  const text = `Hi ${firstName},\n\nYou started joining MoreDone but did not finish payment. Your ${label} will be ${total}.\n\nIf you still want to join, return to checkout here: ${url}\n\nIf you already paid, do not pay again. Reply to this email and we will check it.\n\nRun Rentless`;
  return send(email, firstName, "Still want to join MoreDone?", text, layout(firstName, "Your checkout is still here.", [`You chose ${label} for ${total}, but we have not confirmed a payment.`, "If you still want to join, you can return to checkout below.", "Already paid? Do not pay again. Reply to this email and we will check it."], { label: "Return to checkout", url }));
}

export function sendMoreDonePaymentRequest(email: string, firstName: string, seats: MoreDoneSeats, country: MoreDoneCountry, url: string, reminder = false) {
  const total = moreDonePrice(seats, country);
  const paragraphs = [
    `You selected ${placeLabel(seats)} for ${total} in the MoreDone 7-Day AI Business Challenge, ${moreDoneCohortDates}.`,
    "Bring the website, customer tracker or business tool you want to build. We will guide you through its first working version.",
    "Use the button below to ask our payment team for the details. Your message already includes your name and chosen places.",
    "If you have already paid, reply with your payment reference so we can confirm your place.",
  ];
  return send(email, firstName, reminder ? "Complete your MoreDone registration" : "Your MoreDone payment details", `Hi ${firstName},\n\n${paragraphs.join("\n\n")}\n\n${url}`, layout(firstName, "Your next step: complete your payment.", paragraphs, { label: "Get payment details on WhatsApp", url }));
}

export function sendMoreDoneEmailRequestReceipt(email: string, firstName: string, seats: MoreDoneSeats, country: MoreDoneCountry) {
  const paragraphs = [
    `We have your request for ${placeLabel(seats)} at ${moreDonePrice(seats, country)} for MoreDone, ${moreDoneCohortDates}.`,
    "Our payment team will email you the payment details. You can complete this step by email, without WhatsApp.",
    "Bring the idea you want to build. We will help you turn its main feature into a working tool during the challenge.",
    "Your place is confirmed after payment. If you have a question, reply here and our team will help.",
  ];
  return send(email, firstName, "We received your request for MoreDone payment details", `Hi ${firstName},\n\n${paragraphs.join("\n\n")}`, layout(firstName, "Your payment team will be in touch.", paragraphs));
}

export function sendMoreDonePaymentConfirmation(email: string, firstName: string, seats: MoreDoneSeats, reference: string) {
  const label = placeLabel(seats);
  const total = money(seats);
  const text = `Hi ${firstName},\n\nYour MoreDone payment is confirmed. You have ${label} in the 7-Day AI Business Challenge.\n\nPaid: ${total}\nPayment reference: ${reference}\n\nWe will email your challenge schedule and joining details. Bring the business problem or idea you want to work on. You will use a paid AI building tool during the week; we will help you choose and set it up before the first workshop. That subscription is separate from the challenge fee.\n\nQuestions? Reply to this email.\n\nRun Rentless`;
  return send(email, firstName, "Your MoreDone payment is confirmed", `${text}\n\nCohort: ${moreDoneCohortDates}`, layout(firstName, "Your place is confirmed.", [`Your payment of ${total} for ${label} is complete.`, `Your cohort runs ${moreDoneCohortDates}, live online with GD. Workshop times and joining links will arrive by email.`, `Payment reference: ${reference}`, "Bring the problem or idea you want to work on. We will help you choose the first feature to build.", "You will use a paid AI building tool during the week. We will help you choose and set it up before the first workshop. That subscription is separate from the challenge fee."]));
}
