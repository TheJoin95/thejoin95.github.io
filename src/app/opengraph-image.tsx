import { ImageResponse } from "next/og";

export const alt = "Miki Lombardi — Engineering, with curiosity.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", background: "#111111", color: "#f5f5f5", padding: 64, fontWeight: 400 }}>
      <div style={{ display: "flex", fontSize: 32 }}>Miki Lombardi</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 94, lineHeight: 1.04, letterSpacing: "-0.04em" }}><span>Engineering,</span><span>with curiosity.</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28 }}><div style={{ width: 48, height: 8, background: "#d7ef36" }} />Senior Software Engineer at Adobe</div>
    </div>, size,
  );
}
