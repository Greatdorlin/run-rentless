import { ImageResponse } from "next/og";

export const alt = "Run Rentless — private business software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#031e19", color: "#fdfff4", padding: "72px 80px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#c6ff00", fontSize: 28, fontWeight: 800 }}><span style={{ border: "4px solid #c6ff00", borderRadius: 14, padding: "8px 15px" }}>R</span> RUN RENTLESS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}><div style={{ display: "flex", flexDirection: "column", fontSize: 82, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}><span>Stop renting the software</span><span>your business depends on.</span></div><div style={{ fontSize: 28, color: "#c6ff00" }}>Private deployment · Predictable costs · No compulsory per-user rent</div></div>
    </div>,
    size,
  );
}
