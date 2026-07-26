import { FiMousePointer } from "react-icons/fi";

const handle = "absolute h-3.5 w-3.5 border-cyan animate-handle-pulse";

export default function SelectionFrame({ label = "SELECT.HERO", className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute border border-dashed border-cream/25 ${className}`}
    >
      <span className={`${handle} -left-[3px] -top-[3px] border-l-2 border-t-2`} />
      <span className={`${handle} -right-[3px] -top-[3px] border-r-2 border-t-2`} />
      <span className={`${handle} -bottom-[3px] -left-[3px] border-b-2 border-l-2`} />
      <span className={`${handle} -bottom-[3px] -right-[3px] border-b-2 border-r-2`} />

      <span className="absolute left-0 -top-7 whitespace-nowrap font-mono text-[11px] tracking-wider text-cyan/80">
        {label}
      </span>

      <span className="absolute -bottom-4 -right-4 flex h-8 w-8 rotate-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg">
        <FiMousePointer size={14} />
      </span>
    </div>
  );
}
