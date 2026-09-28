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
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
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
