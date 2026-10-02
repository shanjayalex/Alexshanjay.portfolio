import { useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";

// Runs GSAP setup inside a matchMedia scoped to `scopeRef`, reverted on unmount.
// `build(mm, scope)` registers animations with mm.add(condition, fn).
export function useGsap(scopeRef, build, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;
    const mm = gsap.matchMedia(scopeRef.current);
    build(mm, scopeRef.current);
    return () => mm.revert();
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- deps are forwarded from the caller
  }, deps);
}
