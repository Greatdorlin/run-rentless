"use client";

import type { MoreDoneCountry } from "@/lib/moredone";

export function CountrySwitcher({ country }: { country: MoreDoneCountry }) {
  return <label className="md-country" id="md-country">
    <span>Country</span>
    <select aria-label="Choose your country to see prices" value={country} onChange={(event) => {
      const url = new URL(window.location.href);
      url.searchParams.set("country", event.currentTarget.value);
      url.searchParams.delete("region");
      if (event.currentTarget.value === "ng" && url.searchParams.get("seats") === "2") url.searchParams.delete("seats");
      window.location.assign(url.toString());
    }}>
      <option value="ng">Nigeria</option>
      <option value="rw">Rwanda</option>
      <option value="other">Global</option>
    </select>
  </label>;
}
