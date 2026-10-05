export const BUCKET_COLS = 24;
export const BUCKET_ROWS = 8;

// Fill the hero's render-bucket grid with cells on the client (kept out of the
// pre-rendered HTML — they're only ever used by the intro animation).
export function makeBuckets(grid) {
  if (!grid) return [];
  if (!grid.children.length) {
    grid.append(...Array.from({ length: BUCKET_COLS * BUCKET_ROWS }, () => document.createElement("span")));
  }
  return [...grid.children];
}
