export default function SectionTag({ index, label, dark = false }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className={`font-mono text-sm font-semibold px-3 py-1 rounded-full border ${
          dark
            ? "border-ink/20 text-ink bg-ink/5"
            : "border-cream/20 text-cream/80 bg-cream/5"
        }`}
      >
        {index}
      </span>
      <span
        className={`h-px flex-1 max-w-10 ${dark ? "bg-ink/20" : "bg-cream/20"}`}
      />
      <span className="font-mono uppercase tracking-[0.25em] text-xs font-semibold opacity-70">
        {label}
      </span>
    </div>
  );
}
