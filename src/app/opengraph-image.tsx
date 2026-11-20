import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/social/brand-mark";
import { shareSize } from "@/components/social/title-card";
import { homeIdentity } from "@/content/home";
import { defaultShareAlt } from "@/lib/seo";

export const alt = defaultShareAlt;
export const size = shareSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", background: "#111111", color: "#ffffff", padding: 64, fontWeight: 400 }}>
      <BrandMark size={88} />
      <div style={{ display: "flex", fontSize: 128, lineHeight: 1.02, letterSpacing: "-0.05em" }}>{homeIdentity.name}</div>
      <div style={{ display: "flex", borderTop: "1px solid #555555", paddingTop: 24, fontSize: 35 }}>Software engineering &amp; open source</div>
    </div>, size,
  );
}
