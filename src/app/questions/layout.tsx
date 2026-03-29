// src/app/questions/layout.tsx
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Particles from "@/components/ui/particles";

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_10%_20%,rgba(140,30,255,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,211,25,0.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,41,117,0.18),transparent_45%)]" />

      {/* single particles layer only */}
      <Particles
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
        quantity={140}
        ease={80}
        color="#ffffff"
        refresh
      />

      <Header />

      <main className="relative z-10">{children}</main>

      <Footer />
    </div>
  );
}
