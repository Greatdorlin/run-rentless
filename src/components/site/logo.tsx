import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand-logo" href="/" aria-label="Run Rentless home">
      <Image
        src="/brand/run-rentless-logo-reverse.png"
        alt="Run Rentless"
        width={1280}
        height={546}
        priority
        sizes={compact ? "44px" : "(max-width: 820px) 108px, 118px"}
        className={compact ? "brand-logo__mark" : "brand-logo__image"}
      />
    </Link>
  );
}
