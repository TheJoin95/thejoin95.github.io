/** Original code-authored vector rig for MIC-21. Coordinates are on a 192 × 160 artboard. */
export const foxPalette = { fur: "#d87332", cream: "#fff3df", ink: "#263445" } as const;
type Color = keyof typeof foxPalette;
export type FoxPart = { id: string; pivot: [number, number]; paths: { color: Color; d: string }[] };
// Back-to-front paint order. Each part is an independently editable SVG/Lottie layer.
export const foxParts: FoxPart[] = [
  { id: "tail", pivot: [70, 99], paths: [
    { color: "fur", d: "M76 97 C59 93 45 83 31 74 C19 67 10 68 8 72 C14 83 18 100 31 112 C44 124 64 123 79 112 C85 107 83 101 76 97 Z" },
    { color: "cream", d: "M31 74 C19 67 10 68 8 72 C14 83 18 100 31 112 C29 102 35 101 31 94 C37 96 39 92 37 88 C43 90 43 87 42 85 C38 81 34 77 31 74 Z" },
  ] },
  { id: "far-hind-leg", pivot: [80, 104], paths: [
    { color: "ink", d: "M73 98 C65 111 68 117 82 123 L81 138 C81 141 92 141 94 139 L90 134 L92 118 L83 105 Z" },
  ] },
  { id: "far-front-leg", pivot: [127, 102], paths: [
    { color: "ink", d: "M122 98 L125 119 L119 137 C119 141 129 141 132 139 L130 135 L139 114 L135 98 Z" },
  ] },
  { id: "body", pivot: [105, 106], paths: [
    { color: "fur", d: "M61 101 C61 88 76 82 96 85 C113 87 123 89 130 76 L145 83 C147 97 142 113 129 117 C111 121 100 109 86 112 C74 119 60 114 61 101 Z" },
    { color: "cream", d: "M131 77 L145 83 C147 97 142 109 135 114 L128 105 L131 100 L126 100 L131 91 Z" },
  ] },
  { id: "near-hind-leg", pivot: [77, 106], paths: [
    { color: "fur", d: "M68 98 C59 110 64 120 76 125 L71 136 L81 138 L87 121 L79 110 L87 104 Z" },
    { color: "ink", d: "M75 128 L71 136 C69 140 75 142 82 140 L84 138 L80 135 L83 129 Z" },
  ] },
  { id: "near-front-leg", pivot: [133, 105], paths: [
    { color: "fur", d: "M127 102 C126 111 130 125 134 133 L143 133 L140 121 L142 106 Z" },
    { color: "ink", d: "M131 124 L134 134 L133 138 C136 142 148 141 149 139 L143 135 L140 123 Z" },
  ] },
  { id: "head", pivot: [138, 84], paths: [
    { color: "fur", d: "M128 81 L122 69 L126 57 L121 30 C121 26 124 24 127 28 L141 45 L145 44 L152 25 C153 21 157 22 158 27 L161 48 C164 54 174 59 184 61 C186 62 186 65 182 68 L162 78 L154 91 L148 85 L143 94 L139 86 L133 90 Z" },
    { color: "ink", d: "M125 33 L130 56 L138 47 Z" },
    { color: "ink", d: "M154 29 L149 47 L157 49 Z" },
    { color: "cream", d: "M130 60 C138 68 145 64 153 67 C161 68 170 64 180 65 L161 76 L154 87 L148 82 L143 90 L141 82 L134 85 Z" },
    { color: "ink", d: "M179 60 C183 60 187 61 186 63 C186 66 182 68 180 66 Z" },
    { color: "ink", d: "M153 56 C153 53 158 53 158 56 C158 59 153 59 153 56 Z" },
  ] },
];

export const foxClips = {
  notice: { frames: 30, peak: 10, description: "Ears and head lift to notice a deliberate interaction, then return to rest." },
  follow: { frames: 36, peak: 14, description: "A small head turn, lifted forepaw and tail response follow one connection; no pointer chasing." },
  settle: { frames: 42, peak: 18, description: "A quiet head dip and tail release settle back into the resting pose." },
} as const;
export type FoxClip = keyof typeof foxClips;
export function foxPose(clip: FoxClip | "rest", part: string): { rotation: number; y: number } {
  if (clip === "notice") return { rotation: part === "head" ? -9 : part === "tail" ? 7 : 0, y: part === "head" ? -1 : 0 };
  if (clip === "follow") return { rotation: part === "head" ? 6 : part === "tail" ? -7 : part === "near-front-leg" ? -14 : 0, y: 0 };
  if (clip === "settle") return { rotation: part === "head" ? 9 : part === "tail" ? -10 : 0, y: part === "head" ? 1 : 0 };
  return { rotation: 0, y: 0 };
}
