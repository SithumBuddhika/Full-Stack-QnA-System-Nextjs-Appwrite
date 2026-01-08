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
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-black text-white overscroll-none">
      {/* ✅ Layer 1: Color glow (fixed) */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_10%_20%,rgba(140,30,255,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,211,25,0.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,41,117,0.18),transparent_45%)]" />

      {/* ✅ Layer 2: particles (make it “colorful”, not only white) */}
      <Particles
        className="fixed inset-0 -z-10 h-full w-full"
        quantity={280}
        ease={70}
        color="#ffffff"
        refresh
      />
      <Particles
        className="fixed inset-0 -z-10 h-full w-full opacity-60"
        quantity={140}
        ease={60}
        color="#ff2975"
        refresh
      />
      <Particles
        className="fixed inset-0 -z-10 h-full w-full opacity-45"
        quantity={140}
        ease={60}
        color="#8c1eff"
        refresh
      />
      <Particles
        className="fixed inset-0 -z-10 h-full w-full opacity-40"
        quantity={120}
        ease={60}
        color="#ffd319"
        refresh
      />

      {/* ✅ Header */}
      <Header />

      {/* ✅ Content */}
      <div className="relative z-10">{children}</div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
