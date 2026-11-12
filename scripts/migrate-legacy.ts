import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import matter from "gray-matter";

// Read only the preserved branch. Never check out or mutate the old implementation.
const git = (...args: string[]) => execFileSync("git", args, { maxBuffer: 32 * 1024 * 1024 });
const previous = existsSync("docs/migration/legacy-manifest.json") ? JSON.parse(readFileSync("docs/migration/legacy-manifest.json", "utf8")) as { sourceRef: string; media: { source: string; path: string; sha256: string; width?: number; height?: number; kind: string }[] } : undefined;
const sourceRef = previous?.sourceRef || git("rev-parse", "origin/old").toString().trim();
const files = git("ls-tree", "-r", "--name-only", sourceRef, "public/articles").toString().trim().split("\n");
const index = JSON.parse(git("show", `${sourceRef}:src/assets/articles.json`).toString()) as { permalink: string; date: string; title: string }[];
const hash = (data: Uint8Array | string) => createHash("sha256").update(data).digest("hex");
mkdirSync("content/journal", { recursive: true });
mkdirSync("public/media/blog", { recursive: true });
mkdirSync("public/articles", { recursive: true });
if (files.length !== index.length) throw new Error("Legacy index / file inventory mismatch");
const articles = files.map(source => {
  const bytes = git("show", `${sourceRef}:${source}`);
  const data = matter(bytes.toString()).data;
  const record = index.find(item => item.permalink === data.permalink);
  if (!record) throw new Error(`Missing old index entry: ${source}`);
  const filename = source.split("/").at(-1)!;
  const slug = `${record.date}-${data.permalink}`;
  writeFileSync(`content/journal/${slug}.md`, bytes);
  writeFileSync(source, bytes);
  return { source, filename, slug, title: record.title, date: record.date, sha256: hash(bytes), canonical: `/blog/${slug}`, aliases: filename.slice(0, -3) === slug ? [] : [`/blog/${filename.slice(0, -3)}`] };
});
const media: { source: string; path: string; sha256: string; width?: number; height?: number; kind: string }[] = [];
const all = files.map(f => git("show", `${sourceRef}:${f}`).toString()).join("\n");
const imageSources = [...new Set([...all.matchAll(/!\[[^\]]*\]\((https:[^)]+)\)|<img[^>]+src="(data:image\/png;base64,[^"]+)"/g)].map(m => m[1] || m[2]))];
function cachedMedia(source: string) {
  const old = previous?.media.find(item => item.source === source);
  if (!old || !existsSync(`public${old.path}`)) return undefined;
  if (hash(readFileSync(`public${old.path}`)) !== old.sha256) throw new Error(`Preserved media was changed: ${old.path}`);
  return old;
}
function verifyMedia(source: string, bytes: Uint8Array | string) {
  const old = previous?.media.find(item => item.source === source);
  if (old && hash(bytes) !== old.sha256) throw new Error(`Remote media changed: ${old.path}. Restore the captured version from Git.`);
}
for (const [i, source] of imageSources.entries()) {
  const old = cachedMedia(source);
  if (old) { media.push(old); continue; }
  const bytes = source.startsWith("data:") ? Buffer.from(source.split(",")[1], "base64") : Buffer.from(await (await fetch(source)).arrayBuffer());
  verifyMedia(source, bytes);
  const sharp = (await import("sharp")).default;
  const meta = await sharp(bytes).metadata();
  const path = `/media/blog/legacy-${i + 1}.${meta.format === "jpeg" ? "jpg" : meta.format}`;
  writeFileSync(`public${path}`, bytes);
  media.push({ source, path, sha256: hash(bytes), width: meta.width, height: meta.height, kind: "image" });
}
for (const source of new Set([...all.matchAll(/<script src="(https:\/\/gist.github.com\/[^"]+)"/g)].map(m => m[1]))) {
  const old = cachedMedia(source);
  if (old) { media.push(old); continue; }
  const id = source.split("/").at(-1)!.replace(/\.js$/, "");
  const response = await fetch(`https://api.github.com/gists/${id}`);
  if (!response.ok) throw new Error(`Gist ${id}: ${response.status}`);
  const gist = await response.json() as { files: Record<string, { content: string; truncated: boolean; raw_url: string }> };
  const code = (await Promise.all(Object.entries(gist.files).map(async ([name, file]) => `// ${name}\n${file.truncated ? await (await fetch(file.raw_url)).text() : file.content}`))).join("\n\n");
  verifyMedia(source, code);
  const path = `/media/blog/gist-${id}.txt`;
  writeFileSync(`public${path}`, code);
  media.push({ source, path, sha256: hash(code), kind: "code" });
}
const assets = git("ls-tree", "-r", "--name-only", sourceRef, "public/images", "public/lotties", "public/miki-lombardi-resume.pdf").toString().trim().split("\n").map(path => {
  const bytes = git("show", `${sourceRef}:${path}`);
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, bytes);
  return { path: path.replace(/^public/, ""), sha256: hash(bytes) };
});
writeFileSync("docs/migration/legacy-manifest.json", JSON.stringify({ sourceRef, articles, media, assets, adjustments: ["Original source and raw downloads are byte-identical. Rendering removes obsolete decorative Unsplash covers and wrappers; source URLs remain recoverable in raw downloads.", "First source H1 is rendered by the article template using the original title; historical body text is unchanged.", "Liquid highlight blocks become fenced code. Gist script embeds become locally captured code with a source link; scripts never execute.", "Embedded PNG and four meaningful Medium images are preserved locally with hashes and dimensions.", "Recap uses April 17 publication date and index URL; April 16 filename URL redirects permanently.", "Italian passport article is marked it. No migration date is presented as a writing update."] }, null, 2) + "\n");
console.log(`Migrated ${articles.length} articles, ${media.length} media records, ${assets.length} assets from ${sourceRef}`);
