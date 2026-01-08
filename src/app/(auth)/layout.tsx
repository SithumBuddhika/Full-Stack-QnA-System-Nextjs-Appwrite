// import React from "react";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
//       {children}
//     </div>
//   );
// }

import React from "react";
import Particles from "@/components/ui/particles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={400}
        ease={90}
        color="#ffffff"
        refresh
      />

      {/* subtle vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
