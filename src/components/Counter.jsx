import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export default function Counter({ value, suffix = "", duration = 1.6, className = "" }) {
  const wrapRef = useRef(null);
  const nodeRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      if (nodeRef.current) nodeRef.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (nodeRef.current) nodeRef.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, reduced]);

  return (
    <span ref={wrapRef} className={className}>
      <span ref={nodeRef}>0{suffix}</span>
    </span>
  );
}
