export default function Marquee({ items, className = "" }) {
  const doubled = [...items, ...items];
  return (
    <div className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      <div className="flex w-max animate-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display text-2xl md:text-3xl px-6 flex items-center gap-6 shrink-0"
          >
            {item}
            <span className="text-lg opacity-60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
