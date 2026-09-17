"use client";

import { useEffect, useState } from "react";

export function SpendExample() {
  const [amount, setAmount] = useState(300);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || preference.matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setAmount((value) => value + 25);
    }, 900);
    return () => window.clearInterval(timer);
  }, [paused]);
  return <div className="audit-hero__preview">
    <span>Software costs add up.</span>
    <strong aria-label="Illustrative monthly software spend">${amount.toLocaleString("en-US")}</strong>
    <small>Example monthly bill. Not your audit total.</small>
    <p className="example-three-year">That is <b>${(amount * 36).toLocaleString("en-US")}</b> over three years.</p>
    <button type="button" className="example-pause" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume example" : "Pause example"}</button>
    <div><b>RETAIN</b><b>UPGRADE</b><b>NEW OPTIONS</b></div>
  </div>;
}
