import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = [
  ["Products", "/#products"],
  ["How It Works", "/#how-it-works"],
  ["FAQ", "/#faq"],
  ["Waitlist", "/#waitlist"],
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
          <p>Subscription-free business software prepared and deployed for your team.</p>
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
