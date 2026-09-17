import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = [
  ["Free Audit", "/#audit"],
  ["How It Works", "/#how-it-works"],
  ["The Report", "/#report"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__top">
        <div>
          <Logo />
          <p>See what your software costs—and which workflows may be worth owning.</p>
        </div>
        <nav aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </nav>
      </div>
      <div className="shell site-footer__bottom">
        <p>Prepared for your team. Clear implementation price. No required per-user software subscription.</p>
        <p>© {new Date().getFullYear()} Run Rentless.</p>
      </div>
    </footer>
  );
}
