// import React from "react";
// import Particles from "@/components/ui/particles";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="relative min-h-screen bg-black text-white">
//       <Particles
//         className="fixed inset-0 h-full w-full"
//         quantity={400}
//         ease={90}
//         color="#ffffff"
//         refresh
//       />

//       {/* subtle vignette */}
//       <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

//       <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
//         {children}
//       </div>
//     </div>
//   );
// }

// src/(auth)/layout.tsx
import React from "react";
import Particles from "@/components/ui/particles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* background particles only */}
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={10}
        color="#ffffff"
        refresh
      />

      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(140,30,255,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,41,117,0.16),transparent_45%),radial-gradient(circle_at_60%_10%,rgba(255,211,25,0.12),transparent_40%)]" />

      {/* content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
