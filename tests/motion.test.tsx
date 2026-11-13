import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Play from "@/app/play/page";
import { FoxCompanion } from "@/components/characters/fox-companion";
import { foxAssets } from "@/content/fox";

test("fox companion starts as one decorative, correctly proportioned static poster without inoperative controls", () => {
  const html = renderToStaticMarkup(<FoxCompanion />);
  expect(html.match(/<img/g)).toHaveLength(1);
  expect(html).toContain(foxAssets.poster);
  expect(html).toContain('width="192"'); expect(html).toContain('height="160"');
  expect(html).toContain('alt=""'); expect(html).toContain('aria-hidden="true"');
  expect(html).not.toContain("<button"); expect(html).not.toContain("<canvas");
  expect(html).not.toContain("A quiet corner.");
});

test("Play places a single fox without changing readable identity and authentic project evidence", () => {
  const html = renderToStaticMarkup(<Play />);
  expect(html.match(/data-fox-companion/g)).toHaveLength(1);
  expect(html.match(/src="\/characters\/fox\/rest.svg"/g)).toHaveLength(1);
  expect(html.match(/<h1/g)).toHaveLength(1); expect(html).toContain("Built out of curiosity.");
  expect(html).toContain('application/ld+json');
  expect(html).toContain("Frances Benjamin Johnston");
  expect(html).toContain("Original / actual CLI output");
  expect(html).not.toContain("<audio");
  expect(html).not.toContain("<canvas");
});
