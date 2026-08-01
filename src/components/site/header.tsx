"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "@/content/site";
import { Logo } from "./logo";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Logo />
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={`primary-nav${open ? " primary-nav--open" : ""}`}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link className="button button--small" href="/#waitlist" onClick={() => setOpen(false)}>
            Join the Waitlist
          </Link>
        </nav>
      </div>
    </header>
  );
}
