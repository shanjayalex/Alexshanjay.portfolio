import { fitLength } from "../../lib/type";
import MetaRow from "./MetaRow";
import ScriptWord from "./ScriptWord";
import StencilTitle from "./StencilTitle";

// Recurring editorial header: meta row → ghost script → orange script → stencil word + small tag.
export default function SectionHeader({ meta, ghost, script, title, tag, ring = false, className = "", id }) {
  return (
    <header className={`relative ${className}`}>
      {meta && <MetaRow left={meta[0]} right={meta[1]} />}
      <div className="type-stack relative mt-[max(0.55em,3.75rem)]" style={{ "--len": fitLength(title) }}>
        {ghost && (
          <span
            className="ghost-script pointer-events-none absolute bottom-[80%] left-1/2 -translate-x-1/2 text-[0.4em]"
            aria-hidden="true"
          data-text={ghost}
          />
        )}
        <StencilTitle text={title} ring={ring} id={id} label={title.replaceAll("\n", " ")} className="rgb-split relative" />
        <ScriptWord className="absolute bottom-[42%] left-[0.5%] z-10 -rotate-8 text-[0.55em]">{script}</ScriptWord>
        {tag && (
          <span className="mono-label absolute bottom-[calc(100%+0.9rem)] right-0 text-right">
            <b className="font-bold">{tag}</b>
          </span>
        )}
      </div>
    </header>
  );
}
