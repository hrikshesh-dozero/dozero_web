export default function BlueprintBackground() {
  return (
    <>
      {/* Layer 1: Deep radial navy base */}
      <div className="blueprint-bg" aria-hidden />
      {/* Layer 2: Fine + bold grid lines */}
      <div className="blueprint-grid" aria-hidden />
      {/* Layer 3: Halftone grain overlay */}
      <div className="blueprint-grain" aria-hidden />
    </>
  );
}
