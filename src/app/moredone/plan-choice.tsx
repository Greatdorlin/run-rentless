"use client";

import type { ReactNode, MouseEvent } from "react";
import type { MoreDoneCountry, MoreDoneSeats } from "@/lib/moredone";

export function PlanChoice({ seats, country, children }: { seats: MoreDoneSeats; country: MoreDoneCountry; children: ReactNode }) {
  function choose(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || new URLSearchParams(window.location.search).has("reference")) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("moredone:seats", { detail: seats }));
    const url = new URL(window.location.href);
    url.searchParams.set("seats", String(seats));
    url.hash = "md-registration";
    window.history.replaceState(null, "", url);
    const form = document.getElementById("md-registration");
    form?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    form?.focus({ preventScroll: true });
  }
  return <a className="md-price-row" href={`?seats=${seats}&country=${country}#md-registration`} onClick={choose}>{children}</a>;
}
