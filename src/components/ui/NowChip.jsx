import { profile } from "../../data/content";

// "REC · Now editing" pill next to the monogram — links to the Journey.
// The label grows with the room the nav has: REC → Now editing → full role.
export default function NowChip({ base = "" }) {
  const { role, org } = profile.now;
  return (
    <a
      href={`${base}#journey`}
      className="flex shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-paper-2 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.12em] text-ink transition-colors hover:border-orange-deep"
      aria-label={`Now: ${role} at ${org} — see my journey`}
    >
      <span className="rec-dot shrink-0" aria-hidden="true" />
      <span aria-hidden="true">
        Rec
        <span className="hidden min-[420px]:inline lg:hidden xl:inline 2xl:hidden"> · Now editing</span>
        <span className="hidden 2xl:inline">
          {" "}
          · Now: {role} @ {org}
        </span>
      </span>
    </a>
  );
}
