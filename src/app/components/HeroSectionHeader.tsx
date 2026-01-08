// "use client";

// import React from "react";
// import dynamic from "next/dynamic";
// import Particles from "@/components/ui/particles";
// import ShimmerButton from "@/components/ui/shimmer-button";
// import { useAuthStore } from "@/store/Auth";
// import Link from "next/link";

// // ✅ IMPORTANT: IconCloud must NOT SSR (it generates random canvas ids)
// const IconCloud = dynamic(
//   () => import("@/components/ui/icon-cloud").then((m) => m.IconCloud),
//   { ssr: false }
// );

// const slugs = [
//   "typescript",
//   "javascript",
//   "dart",
//   "java",
//   "react",
//   "flutter",
//   "android",
//   "html5",
//   "css3",
//   "nodedotjs",
//   "express",
//   "nextdotjs",
//   "prisma",
//   "amazonaws",
//   "postgresql",
//   "firebase",
//   "nginx",
//   "vercel",
//   "testinglibrary",
//   "jest",
//   "cypress",
//   "docker",
//   "git",
//   "jira",
//   "github",
//   "gitlab",
//   "visualstudiocode",
//   "androidstudio",
//   "sonarqube",
//   "figma",
// ];

// const HeroSectionHeader = () => {
//   const { session } = useAuthStore();

//   return (
//     <div className="container mx-auto px-4">
//       <Particles
//         className="fixed inset-0 h-full w-full"
//         quantity={500}
//         ease={100}
//         color="#ffffff"
//         refresh
//       />

//       <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
//         <div className="flex items-center justify-center">
//           <div className="space-y-4 text-center">
//             <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
//               Inquierly
//             </h1>

//             <p className="text-center text-xl font-bold leading-none tracking-tighter text-white/90">
//               Ask questions, share knowledge, and collaborate with developers
//               worldwide. Join our community and enhance your coding skills!
//             </p>

//             <div className="flex items-center justify-center gap-4">
//               {session ? (
//                 <Link href="/questions/ask">
//                   <ShimmerButton className="shadow-2xl">
//                     <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
//                       Ask a question
//                     </span>
//                   </ShimmerButton>
//                 </Link>
//               ) : (
//                 <>
//                   <Link href="/register">
//                     <ShimmerButton className="shadow-2xl">
//                       <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
//                         Sign up
//                       </span>
//                     </ShimmerButton>
//                   </Link>

//                   <Link
//                     href="/login"
//                     className="relative rounded-full border border-neutral-200 px-8 py-3 font-medium text-white dark:border-white/[0.2]"
//                   >
//                     <span>Login</span>
//                     <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-center">
//           {/* give it a height so it actually shows */}
//           <div className="relative h-[420px] w-full max-w-[32rem] overflow-hidden">
//             <IconCloud iconSlugs={slugs} className="h-full w-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSectionHeader;

"use client";

import { IconCloud } from "@/components/ui/icon-cloud";
import Particles from "@/components/ui/particles";
import ShimmerButton from "@/components/ui/shimmer-button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import React from "react";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export default function HeroSectionHeader() {
  const { session } = useAuthStore();

  return (
    <div className="container mx-auto px-4">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={50} // ✅ faster feel (you asked about speed)
        color="#ffffff"
        refresh
      />

      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center">
          <div className="space-y-4 text-center">
            <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
              Inquierly
            </h1>

            <p className="text-center text-xl font-bold leading-none tracking-tighter text-white/90">
              Ask questions, share knowledge, and collaborate with developers
              worldwide. Join our community and enhance your coding skills!
            </p>

            <div className="flex items-center justify-center gap-4">
              {session ? (
                // ✅ YOU WANTED THIS:
                <Link href="/questions">
                  <ShimmerButton className="shadow-2xl">
                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                      Ask a question
                    </span>
                  </ShimmerButton>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <ShimmerButton className="shadow-2xl">
                      <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                        Sign up
                      </span>
                    </ShimmerButton>
                  </Link>

                  <Link
                    href="/login"
                    className="relative rounded-full border border-neutral-200 px-8 py-3 font-medium text-white dark:border-white/[0.2]"
                  >
                    <span>Login</span>
                    <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative max-w-[32rem] overflow-hidden">
            <IconCloud iconSlugs={slugs} />
          </div>
        </div>
      </div>
    </div>
  );
}
