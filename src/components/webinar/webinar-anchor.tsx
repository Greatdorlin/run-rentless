"use client";

import type { MouseEvent, ReactNode } from "react";

type WebinarAnchorProps = {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
};

export function WebinarAnchor({ href, className, children }: WebinarAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.querySelector(href);
    if (!(target instanceof HTMLElement)) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  }

  return <a className={className} href={href} onClick={handleClick}>{children}</a>;
}
