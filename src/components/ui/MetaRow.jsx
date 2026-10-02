// "BUILT TO INSPIRE ──────── UPDATED 2026": first word left and last word right in bold.
export default function MetaRow({ left, right, className = "" }) {
  const [leftFirst, ...leftRest] = left.split(" ");
  const rightWords = right.split(" ");
  const rightLast = rightWords.pop();

  return (
    <div className={`mono-label flex items-center gap-4 ${className}`} data-meta>
      <span className="shrink-0">
        <b className="font-bold">{leftFirst}</b> {leftRest.join(" ")}
      </span>
      <span className="h-px flex-1 bg-current opacity-35" />
      <span className="shrink-0">
        {rightWords.join(" ")} <b className="font-bold">{rightLast}</b>
      </span>
    </div>
  );
}
