// Bakes every page (home + SEO landing pages) into static HTML so search
// engines and AI crawlers (which don't run JavaScript) see the full content,
// each with its own <title>, description, canonical URL and JSON-LD.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const template = await readFile(resolve("dist/index.html"), "utf8");
const { render, head, routes } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);

const root = '<div id="root"></div>';
if (!template.includes(root)) throw new Error(`prerender: ${root} not found in dist/index.html`);
if (!template.includes("</head>")) throw new Error("prerender: </head> not found");

for (const route of routes) {
  const html = template.replace("</head>", `    ${head(route)}\n  </head>`).replace(root, `<div id="root">${render(route)}</div>`);
  const file = resolve("dist", `.${route}`, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`prerender: ${route} → ${(html.length / 1024).toFixed(1)} kB`);
}
await rm(resolve("dist-ssr"), { recursive: true, force: true });
