// Approximate rendered width of a display line in "average glyph" units, so
// `.type-stack` can size giant words to fit the viewport without overflow.
const WEIGHTS = { I: 0.45, " ": 0.35, "'": 0.3, ".": 0.4, "&": 1.1, M: 1.25, W: 1.3 };

export function fitLength(text) {
  return Math.max(
    ...String(text)
      .toUpperCase()
      .split("\n")
      .map((line) => [...line].reduce((sum, ch) => sum + (WEIGHTS[ch] ?? 1), 0)),
  );
}
