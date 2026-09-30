"use client";

import { useState } from "react";
import { siTelegram, siWhatsapp } from "simple-icons";

const url = "https://www.runrentless.com/webinar";
const title = "Making AI Make Business Sense";
const invitation = `Join me for ${title}, a free live webinar on Saturday, 10th October 2026 at 6PM GMT+1. ${url}`;

const channels = [
  { label: "WhatsApp", icon: "whatsapp", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(invitation)}`, external: true },
  { label: "Message", icon: "message", href: `sms:?body=${encodeURIComponent(invitation)}`, external: false },
  { label: "Email", icon: "email", href: `mailto:?subject=${encodeURIComponent(`Join me for ${title}`)}&body=${encodeURIComponent(invitation)}`, external: false },
  { label: "Telegram", icon: "telegram", href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Join me for ${title}, a free live webinar on Saturday, 10th October 2026 at 6PM GMT+1.`)}`, external: true },
] as const;

function ShareIcon({ kind }: { kind: (typeof channels)[number]["icon"] | "link" }) {
  if (kind === "whatsapp" || kind === "telegram") {
    const mark = kind === "whatsapp" ? siWhatsapp : siTelegram;
    return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={mark.path} fill={`#${mark.hex}`} /></svg>;
  }
  if (kind === "message") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l2.2-3.2A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11.5h9" /></svg>;
  if (kind === "email") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M10 13.5a4 4 0 0 0 6.5.5l2-2a4 4 0 1 0-5.7-5.7l-1.2 1.2" /><path d="M14 10.5a4 4 0 0 0-6.5-.5l-2 2a4 4 0 1 0 5.7 5.7l1.2-1.2" /></svg>;
}

export function WebinarShare({ compact = false }: { compact?: boolean }) {
  const [copyStatus, setCopyStatus] = useState("");
  const Heading = compact ? "h4" : "h2";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("Link copied");
    } catch {
      setCopyStatus("Could not copy. Use the page address instead.");
    }
  }

  return <div className={`webinar-share${compact ? " webinar-share--compact" : ""}`}>
    <div className="webinar-share__intro">
      <span className="webinar-share__eyebrow">{compact ? "Bring someone with you" : "Pass it on"}</span>
      <Heading>{compact ? "Know someone who should join you?" : "Know someone who should be here?"}</Heading>
      <p>{compact ? "Send them a free spot while it’s on your mind." : "One invite could give a friend or colleague a better way to use AI in their business."}</p>
    </div>
    <div className="webinar-share__actions" aria-label="Share this webinar">
      {channels.map(({ label, icon, href, external }) => <a key={label} href={href} aria-label={`Invite via ${label}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span className="webinar-share__icon"><ShareIcon kind={icon} /></span><span className="webinar-share__label">{label}</span></a>)}
      <button type="button" onClick={copyLink} aria-label="Copy webinar link"><span className="webinar-share__icon"><ShareIcon kind="link" /></span><span className="webinar-share__label">Copy link</span></button>
    </div>
    {copyStatus && <span className="webinar-share__status" role="status">{copyStatus}</span>}
  </div>;
}
