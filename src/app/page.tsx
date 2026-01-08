// src/app/page.tsx
import React from "react";
import HeroSection from "@/app/components/HeroSection";
import LatestQuestions from "@/app/components/LatestQuestions";
import TopContributers from "@/app/components/TopContributers";

export default function Home() {
  return (
    <div className="h-[100svh] w-full overflow-hidden">
      <HeroSection />

      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 pb-20 pt-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Latest Questions</h2>
          <LatestQuestions />
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">Top Contributers</h2>
          <TopContributers />
        </div>
      </div>
    </div>
  );
}
