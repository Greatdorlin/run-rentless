"use client";

import { useEffect, useState } from "react";
import { WEBINAR_START, webinarPhase } from "@/lib/webinar";

function parts(remaining: number) {
  const seconds = Math.max(0, Math.floor(remaining / 1000));
  return [
    Math.floor(seconds / 86400),
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ];
}

export function WebinarCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const sync = async () => {
      try {
        const response = await fetch("/api/webinar/time", { cache: "no-store" });
        if (!response.ok) return;
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || !("now" in data) || typeof data.now !== "number") return;
        if (cancelled) return;
        const serverNow = data.now;
        const startedAt = performance.now();
        const update = () => setNow(serverNow + (performance.now() - startedAt));
        update();
        if (timer !== undefined) window.clearInterval(timer);
        timer = window.setInterval(update, 1000);
      } catch {
        // Keep the countdown hidden if trusted time is unavailable.
      }
    };
    void sync();
    const resync = window.setInterval(() => void sync(), 5 * 60 * 1000);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearInterval(timer);
      window.clearInterval(resync);
    };
  }, []);

  const phase = now === null ? "upcoming" : webinarPhase(now);
  if (phase === "ended") return <div className="webinar-countdown webinar-countdown--status" role="status">The live webinar has ended.</div>;
  if (phase === "live") return <div className="webinar-countdown webinar-countdown--status" role="status"><span className="webinar-countdown__dot" /> Live now <small>Until 8PM GMT+1 on 10th October</small></div>;

  const values = now === null ? [null, null, null, null] : parts(WEBINAR_START - now);
  return (
    <div className="webinar-countdown" aria-label="Time until the webinar begins">
      <div className="webinar-countdown__digits" aria-live="off">
        {values.map((value, index) => (
          <span className="webinar-countdown__unit" key={index}>
            <strong>{value === null ? "--" : String(value).padStart(2, "0")}</strong>
            <small>{["days", "hours", "minutes", "seconds"][index]}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
