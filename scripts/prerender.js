// Bakes the rendered app into dist/index.html so search engines and AI
// crawlers (which don't run JavaScript) see every section as plain HTML.
import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const dist = resolve("dist/index.html");
const server = resolve("dist-ssr/entry-server.js");

const { render } = await import(pathToFileURL(server).href);
const template = await readFile(dist, "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);

const html = template.replace(marker, `<div id="root">${render()}</div>`);
await writeFile(dist, html);
await rm(resolve("dist-ssr"), { recursive: true, force: true });
console.log(`prerender: wrote ${(html.length / 1024).toFixed(1)} kB to dist/index.html`);
