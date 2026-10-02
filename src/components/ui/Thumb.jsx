import { useEffect, useRef, useState } from "react";

// <img> that walks a fallback chain. YouTube serves a 120px grey stub with
// a 404 when a size is missing, so tiny loads also count as failures.
export default function Thumb({ sources, alt, className = "", width = 1280, height = 720, eager = false }) {
  const [state, setState] = useState({ key: sources[0], index: 0 });
  const index = state.key === sources[0] ? state.index : 0;
  const last = index >= sources.length - 1;

  function next() {
    if (!last) setState({ key: sources[0], index: index + 1 });
  }

  // Pre-rendered <img> may have loaded (or failed) before React attached handlers.
  const ref = useRef(null);
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth <= 120 && !last) setState({ key: sources[0], index: index + 1 });
  }, [index, last, sources]);

  return (
    <img
      ref={ref}
      src={sources[index]}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={next}
      onLoad={(e) => e.currentTarget.naturalWidth <= 120 && next()}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
