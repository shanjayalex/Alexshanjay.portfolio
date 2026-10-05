import { gsap } from "../../lib/gsap";
import { BASE, EASE } from "../../lib/motion";

// Turns the Shorts strip into a 3D "phone reel" (desktop + motion only).
// The cards stay in the DOM order the server rendered; this only positions
// them. Draggable + InertiaPlugin are passed in after a dynamic import so they
// never load on phones. Returns a cleanup function.
export function setupPhoneCarousel({ viewport, track, prev, next, Draggable, InertiaPlugin, onDragStart }) {
  const items = [...track.children];
  const count = items.length;
  let spacing = 0;
  let active = -1;
  const proxy = document.createElement("div");
  const blur = gsap.quickTo(track, "--drag-blur", { duration: 0.25, ease: "power2" });

  const ctx = gsap.context(() => {
    viewport.classList.add("is-carousel");

    function measure() {
      const w = items[0].offsetWidth;
      spacing = w * 0.62;
      const tallest = Math.max(...items.map((it) => it.offsetHeight));
      track.style.height = `${tallest + 40}px`;
    }

    function render() {
      const p = -gsap.getProperty(proxy, "x") / spacing;
      items.forEach((item, i) => {
        const o = i - p;
        const d = Math.min(Math.abs(o), 3);
        gsap.set(item, {
          x: o * spacing,
          rotationY: gsap.utils.clamp(-62, 62, -o * 34),
          z: -d * 150,
          transformPerspective: 1600,
          opacity: 1 - d * 0.22,
          zIndex: 100 - Math.round(d * 10),
        });
      });
      const nearest = gsap.utils.clamp(0, count - 1, Math.round(p));
      if (nearest !== active) setActive(nearest);
    }

    // Centre card: slow Ken Burns on its thumbnail (no preview clips exist yet).
    function setActive(index) {
      items.forEach((item, i) => {
        const img = item.querySelector("img");
        item.toggleAttribute("data-active", i === index);
        if (!img) return;
        gsap.killTweensOf(img);
        gsap.to(img, i === index ? { scale: 1.06, duration: 6, ease: "none" } : { scale: 1, duration: BASE, ease: EASE.keyframe });
      });
      active = index;
      prev.disabled = index === 0;
      next.disabled = index === count - 1;
    }

    function goTo(index) {
      const i = gsap.utils.clamp(0, count - 1, index);
      gsap.to(proxy, { x: -i * spacing, duration: BASE, ease: EASE.keyframe, onUpdate: render });
    }

    measure();
    render();

    const [drag] = Draggable.create(proxy, {
      type: "x",
      trigger: viewport,
      inertia: true,
      dragClickables: true,
      minimumMovement: 6,
      edgeResistance: 0.85,
      bounds: { minX: -(count - 1) * spacing, maxX: 0 },
      snap: (v) => Math.round(v / spacing) * spacing,
      onDragStart: onDragStart,
      onDrag() {
        render();
        blur(Math.min(Math.abs(InertiaPlugin.getVelocity(proxy, "x")) / 1500, 1) * 3);
      },
      onThrowUpdate() {
        render();
        blur(Math.min(Math.abs(InertiaPlugin.getVelocity(proxy, "x")) / 1500, 1) * 3);
      },
      onThrowComplete: () => blur(0),
      onRelease: () => blur(0),
    });

    const onPrev = () => goTo(active - 1);
    const onNext = () => goTo(active + 1);
    const onFocus = (e) => {
      const i = items.findIndex((it) => it.contains(e.target));
      if (i >= 0 && i !== active) goTo(i);
    };
    const onResize = () => {
      measure();
      drag.applyBounds({ minX: -(count - 1) * spacing, maxX: 0 });
      gsap.set(proxy, { x: -active * spacing });
      render();
    };
    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);
    track.addEventListener("focusin", onFocus);
    window.addEventListener("resize", onResize);
    prev.parentElement.hidden = false;

    return () => {
      drag.kill();
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
      track.removeEventListener("focusin", onFocus);
      window.removeEventListener("resize", onResize);
    };
  });

  return () => {
    ctx.revert();
    viewport.classList.remove("is-carousel");
    track.style.removeProperty("height");
    track.style.removeProperty("--drag-blur");
    prev.parentElement.hidden = true;
    items.forEach((item) => item.removeAttribute("data-active"));
  };
}
