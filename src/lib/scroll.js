// Holds the active Lenis instance (null when reduced motion is on) and a
// lock counter so the preloader, menu and lightbox can each hold scroll.
export const scroller = { lenis: null, locks: 0 };

export function lockScroll() {
  scroller.locks += 1;
  scroller.lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  scroller.locks = Math.max(0, scroller.locks - 1);
  if (scroller.locks) return;
  document.documentElement.style.overflow = "";
  scroller.lenis?.start();
}

export function scrollToTarget(hash) {
  const el = hash === "#top" ? null : document.querySelector(hash);
  if (hash !== "#top" && !el) return;
  if (scroller.lenis) scroller.lenis.scrollTo(el ?? 0, { duration: 1.4, force: true });
  else if (el) el.scrollIntoView();
  else window.scrollTo(0, 0);
}
