"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingWaitlist() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");

    if (!hero) {
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      className={`floating-waitlist${visible ? " floating-waitlist--visible" : ""}`}
      href="/#waitlist"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      Join the Waitlist <span aria-hidden="true">↗</span>
    </Link>
  );
}
