export const shareSize = { width: 1200, height: 630 };
export function TitleCard({ title, label, detail }: { title: string; label: string; detail: string }) {
  return <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 64, background: "#111111", color: "#f5f5f5" }}>
    <div style={{ display: "flex", color: "#d7ef36", fontSize: 28 }}>MIKI LOMBARDI · {label}</div>
    <div style={{ display: "flex", fontSize: title.length > 180 ? 42 : title.length > 90 ? 52 : 64, lineHeight: 1.12, letterSpacing: "-0.03em", overflowWrap: "anywhere" }}>{title}</div>
    <div style={{ display: "flex", fontSize: 26 }}>{detail}</div>
  </div>;
}
