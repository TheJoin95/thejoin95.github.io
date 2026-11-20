import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/social/brand-mark";
import { shareSize } from "@/components/social/title-card";
import { homeIdentity } from "@/content/home";
import { defaultShareAlt } from "@/lib/seo";

export const alt = defaultShareAlt;
export const size = shareSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  const portrait = readFileSync(join(process.cwd(), "assets/social/miki-portrait.jpg"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f5f5", color: "#111111" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 680, padding: 64 }}>
        <BrandMark size={68} />
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, lineHeight: 0.94, letterSpacing: "-0.065em", maxWidth: 480 }}>
          {homeIdentity.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, letterSpacing: "-0.025em" }}>Software engineering &amp; open source</div>
      </div>
      <div style={{ display: "flex", width: 520, height: 630, borderLeft: "10px solid #d7ef36" }}>
        {/* ImageResponse embeds the local JPEG directly in the PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/jpeg;base64,${portrait.toString("base64")}`} width={510} height={630} style={{ objectFit: "cover" }} alt="" />
      </div>
    </div>, size,
  );
}
