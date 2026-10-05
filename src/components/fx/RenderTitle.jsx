import StencilTitle from "../ui/StencilTitle";

// "Render pass" overlay for a stencil title: a wireframe copy (outlines only)
// over a grid of paper-coloured render buckets that hide the filled word.
// The hero timeline flips the buckets off from the centre out, then fades
// the wireframe. Both layers stay hidden (display: none) unless motion is on.
export default function RenderTitle({ title }) {
  return (
    <>
      <span data-buckets className="render-buckets" aria-hidden="true" />
      <span data-outline className="render-outline" aria-hidden="true">
        <StencilTitle as="span" text={title} ring outline reveal={false} className="block" />
      </span>
    </>
  );
}
