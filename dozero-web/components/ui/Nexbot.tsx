'use client';

// Client Spline (not the /next async server-component variant) so it can be used
// inside client components like the bento grid. Fills whatever container it's in.
import Spline from '@splinetool/react-spline';

export default function Nexbot() {
  return (
    <div className="w-full h-full">
      <Spline scene="https://prod.spline.design/A9aAfXW29nNBLHHf/scene.splinecode" />
    </div>
  );
}
