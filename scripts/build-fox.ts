import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SVGPathData } from "svg-pathdata";
import { zipSync, strToU8 } from "fflate";
import { foxParts, foxPalette, foxClips, foxPose, type FoxClip } from "../assets/fox/model";

type Point = [number, number];
// SVGPathData handles parsing/normalization; this adapter writes Lottie's tangent form.
export function lottiePath(d: string) {
  const commands = new SVGPathData(d).toAbs().normalizeHVZ().normalizeST().qtToC().aToC().commands;
  const v: Point[] = [], i: Point[] = [], o: Point[] = [];
  for (const command of commands) {
    if (command.type === SVGPathData.MOVE_TO || command.type === SVGPathData.LINE_TO) {
      v.push([command.x, command.y]); i.push([0, 0]); o.push([0, 0]);
    } else if (command.type === SVGPathData.CURVE_TO) {
      const previous = v[v.length - 1];
      o[o.length - 1] = [command.x1 - previous[0], command.y1 - previous[1]];
      v.push([command.x, command.y]); i.push([command.x2 - command.x, command.y2 - command.y]); o.push([0, 0]);
    }
  }
  // Closed paths often end at their first vertex; preserve its incoming tangent.
  if (v.length > 1 && v[0][0] === v.at(-1)![0] && v[0][1] === v.at(-1)![1]) { i[0] = i.pop()!; v.pop(); o.pop(); }
  return { v, i, o, c: true };
}
const fixed = (k: unknown) => ({ a: 0, k });
const rgb = (hex: string) => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
const ease = { i: { x: [0.175], y: [1] }, o: { x: [0.77], y: [0] } };
function animated(value: number[], peak: number[], frame: number, end: number) {
  if (value.every((v, index) => v === peak[index])) return fixed(value.length === 1 ? value[0] : value);
  return { a: 1, k: [{ t: 0, s: value, e: peak, ...ease }, { t: frame, s: peak, e: value, ...ease }, { t: end, s: value }] };
}
export function foxAnimation(clip: FoxClip) {
  const timing = foxClips[clip];
  return { v: "5.12.2", fr: 30, ip: 0, op: timing.frames, w: 192, h: 160, nm: `Miki fox — ${clip}`, ddd: 0, assets: [],
    markers: [{ tm: 0, cm: "rest", dr: 0 }, { tm: timing.peak, cm: clip, dr: 0 }, { tm: timing.frames - 1, cm: "rest", dr: 0 }],
    layers: foxParts.toReversed().map((part, index) => {
      const pose = foxPose(clip, part.id), [x, y] = part.pivot;
      return { ddd: 0, ind: index + 1, ty: 4, nm: part.id, sr: 1, ip: 0, op: timing.frames, st: 0, bm: 0,
        ks: { o: fixed(100), r: animated([0], [pose.rotation], timing.peak, timing.frames - 1), p: animated([x, y, 0], [x, y + pose.y, 0], timing.peak, timing.frames - 1), a: fixed([x, y, 0]), s: fixed([100, 100, 100]) },
        shapes: part.paths.toReversed().map((path, j) => ({ ty: "gr", nm: `${part.id}-${j}`, it: [
          { ty: "sh", ks: fixed(lottiePath(path.d)), nm: "contour" },
          { ty: "fl", c: fixed([...rgb(foxPalette[path.color]), 1]), o: fixed(100), r: 1 },
          { ty: "tr", p: fixed([0, 0]), a: fixed([0, 0]), s: fixed([100, 100]), r: fixed(0), o: fixed(100), sk: fixed(0), sa: fixed(0) },
        ] })),
      };
    }) };
}
export function foxSvg(pose: FoxClip | "rest" = "rest", editable = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg"${editable ? ' xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"' : ""} width="192" height="160" viewBox="0 0 192 160"><title>Miki fox — ${pose}</title>${foxParts.map(part => {
    const transform = foxPose(pose, part.id);
    return `<g id="${part.id}"${editable ? ` inkscape:groupmode="layer" inkscape:label="${part.id}"` : ""} transform="translate(0 ${transform.y}) rotate(${transform.rotation} ${part.pivot.join(" ")})">${part.paths.map(path => `<path fill="${foxPalette[path.color]}" d="${path.d}"/>`).join("")}</g>`;
  }).join("")}</svg>\n`;
}
export function buildFox() {
  mkdirSync("public/animations/fox", { recursive: true });
  mkdirSync("public/characters/fox", { recursive: true });
  // Resolve the installed player so runtime bytes always match bun.lock.
  const runtime = dirname(fileURLToPath(import.meta.resolve("@lottiefiles/dotlottie-web")));
  mkdirSync("public/animations/runtime", { recursive: true });
  copyFileSync(join(runtime, "dotlottie-player.wasm"), "public/animations/runtime/dotlottie-player.wasm");
  copyFileSync(join(runtime, "../LICENSE"), "public/animations/runtime/LICENSE.txt");
  writeFileSync("assets/fox/fox-layered.svg", foxSvg("rest", true));
  for (const pose of ["rest", "notice", "follow", "settle"] as const) writeFileSync(`public/characters/fox/${pose}.svg`, foxSvg(pose));
  for (const clip of Object.keys(foxClips) as FoxClip[]) {
    const json = JSON.stringify(foxAnimation(clip));
    writeFileSync(`public/animations/fox/${clip}.json`, json + "\n");
    writeFileSync(`public/animations/fox/${clip}.lottie`, zipSync({
      "manifest.json": strToU8(JSON.stringify({ version: "1.0", generator: "MIC-21 original vector exporter", animations: [{ id: clip, loop: false, autoplay: false }] })),
      [`animations/${clip}.json`]: strToU8(json),
    }, { level: 9, mtime: new Date(2026, 0, 1, 0, 0, 0) }));
  }
  const files = ["assets/fox/model.ts", "assets/fox/fox-layered.svg", ...["rest", "notice", "follow", "settle"].map(pose => `public/characters/fox/${pose}.svg`),
    ...Object.keys(foxClips).flatMap(clip => [`public/animations/fox/${clip}.json`, `public/animations/fox/${clip}.lottie`])];
  writeFileSync("assets/fox/manifest.json", JSON.stringify({ model: "Miki fox", artboard: [192, 160], palette: foxPalette, fps: 30,
    authorship: "Original vector construction authored with Codex for this portfolio; not Miki-authored comic artwork.",
    clips: foxClips, files: files.map(path => { const bytes = readFileSync(path); return { path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") }; }),
  }, null, 2) + "\n");
}
if (import.meta.main) buildFox();
