"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content/site";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    const closeOnNavigate = () => setOpen(false);
    window.addEventListener("runrentless:navigate", closeOnNavigate);
    const wideScreen = window.matchMedia("(min-width: 821px)");
    const closeOnResize = () => { if (wideScreen.matches) setOpen(false); };
    wideScreen.addEventListener("change", closeOnResize);
    return () => {
      delete document.body.dataset.menuOpen;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("runrentless:navigate", closeOnNavigate);
      wideScreen.removeEventListener("change", closeOnResize);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Logo onClick={() => setOpen(false)} />
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
          <Link className="button button--small" href={pathname === "/webinar-pay" ? "/webinar-pay#checkout" : "/#audit"} onClick={() => setOpen(false)}>
            {pathname === "/webinar-pay" ? "Choose your seats" : "Start Free Audit"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
