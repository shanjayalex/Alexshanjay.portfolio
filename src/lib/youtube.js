const ID_RE = /^[\w-]{11}$/;

// Accepts a bare ID or any YouTube URL (watch, youtu.be, shorts, embed)
// and returns the 11-char ID, dropping ?si= and other tracking params.
export function parseId(input) {
  const value = String(input).trim();
  if (ID_RE.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname.endsWith("youtu.be")) return url.pathname.slice(1, 12);
    const v = url.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const match = url.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{11})/);
    if (match) return match[1];
  } catch {
    // not a URL — fall through
  }
  return value.split(/[?&#]/)[0];
}

// Ordered fallback chain of thumbnail URLs.
export function thumb(id, vertical = false) {
  const base = `https://i.ytimg.com/vi/${parseId(id)}`;
  return vertical
    ? [`${base}/oardefault.jpg`, `${base}/hqdefault.jpg`]
    : [`${base}/maxresdefault.jpg`, `${base}/sddefault.jpg`, `${base}/hqdefault.jpg`];
}

export function embed(id) {
  return `https://www.youtube-nocookie.com/embed/${parseId(id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
}

export function watchUrl(id, vertical = false) {
  const clean = parseId(id);
  return vertical ? `https://www.youtube.com/shorts/${clean}` : `https://www.youtube.com/watch?v=${clean}`;
}
