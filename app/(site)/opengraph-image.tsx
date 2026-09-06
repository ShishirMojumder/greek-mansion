import { ImageResponse } from "next/og";

export const alt = "Greek Mansion — Greek Restaurant in Scarborough";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E2A78",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 10, color: "#C9A227", fontWeight: 700 }}>GREEK MANSION</div>
        <div style={{ fontSize: 82, fontWeight: 800, marginTop: 18, lineHeight: 1.05 }}>Fresh Greek. Fair Prices.</div>
        <div style={{ fontSize: 30, marginTop: 22, color: "rgba(255,255,255,0.72)" }}>
          Souvlaki · Gyro · Family catering — Scarborough
        </div>
      </div>
    ),
    size,
  );
}
