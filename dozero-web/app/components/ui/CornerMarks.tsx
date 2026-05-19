/**
 * CornerMarks
 * Renders blueprint-style L-shaped registration ticks in all four corners
 * of the nearest `position: relative` ancestor.
 */
export default function CornerMarks() {
  return (
    <>
      <span className="corner-mark tl" aria-hidden />
      <span className="corner-mark tr" aria-hidden />
      <span className="corner-mark bl" aria-hidden />
      <span className="corner-mark br" aria-hidden />
    </>
  );
}
