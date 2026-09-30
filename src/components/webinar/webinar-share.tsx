"use client";

import { useState } from "react";

const url = "https://www.runrentless.com/webinar";
const title = "Making AI Make Business Sense";
const invitation = `Join me for ${title}, a free live webinar on Saturday, 10th October 2026 at 6PM GMT+1. ${url}`;

const channels = [
  { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(invitation)}`, external: true },
  { label: "Text message", href: `sms:?body=${encodeURIComponent(invitation)}`, external: false },
  { label: "Email", href: `mailto:?subject=${encodeURIComponent(`Join me for ${title}`)}&body=${encodeURIComponent(invitation)}`, external: false },
  { label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Join me for ${title}, a free live webinar on Saturday, 10th October 2026 at 6PM GMT+1.`)}`, external: true },
] as const;

export function WebinarShare({ compact = false }: { compact?: boolean }) {
  const [copyStatus, setCopyStatus] = useState("");

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
      <strong>Know someone who should be here?</strong>
      <span>Invite them to the free webinar.</span>
    </div>
    <div className="webinar-share__actions" aria-label="Share this webinar">
      {channels.map(({ label, href, external }) => <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}<span aria-hidden="true">↗</span></a>)}
      <button type="button" onClick={copyLink}>Copy link<span aria-hidden="true">↗</span></button>
    </div>
    {copyStatus && <span className="webinar-share__status" role="status">{copyStatus}</span>}
  </div>;
}
