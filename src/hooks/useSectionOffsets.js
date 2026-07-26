import { useEffect, useState } from "react";

const IDS = ["top", "about", "services", "showreel", "work", "experience", "contact"];

function measure() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return IDS.map((id, i) => ({ id, progress: i / (IDS.length - 1) }));
  return IDS.map((id) => {
    const el = document.getElementById(id);
    const top = el ? el.offsetTop : 0;
    return { id, progress: Math.min(1, Math.max(0, top / max)) };
  });
}

export function useSectionOffsets() {
  const [offsets, setOffsets] = useState(() =>
    IDS.map((id, i) => ({ id, progress: i / (IDS.length - 1) }))
  );

  useEffect(() => {
    function update() {
      setOffsets(measure());
    }
    update();
    const t1 = setTimeout(update, 400);
    const t2 = setTimeout(update, 1200);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", update);
    };
  }, []);

  return offsets;
}
