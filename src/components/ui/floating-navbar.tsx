// "use client";

// import React, { useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
// } from "framer-motion";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useAuthStore } from "@/store/Auth";

// type NavItem = {
//   name: string;
//   link: string;
//   icon?: React.ReactNode; // ✅ FIX
// };

// export const FloatingNav = ({
//   navItems,
//   className,
// }: {
//   navItems: NavItem[];
//   className?: string;
// }) => {
//   const { scrollYProgress, scrollY } = useScroll();
//   const { session, logout } = useAuthStore();
//   const [visible, setVisible] = useState(true);

//   useMotionValueEvent(scrollYProgress, "change", (current) => {
//     if (scrollY.get() === 0) {
//       setVisible(true);
//       return;
//     }

//     if (typeof current === "number") {
//       const prev = scrollYProgress.getPrevious() ?? current;
//       const direction = current - prev;

//       if (scrollYProgress.get() < 0.05) {
//         setVisible(false);
//       } else {
//         setVisible(direction < 0);
//       }
//     }
//   });

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{ opacity: 1, y: -100 }}
//         animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
//         transition={{ duration: 0.2 }}
//         className={cn(
//           "fixed inset-x-0 top-10 z-50 mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-transparent bg-white py-2 pl-8 pr-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:border-white/[0.2] dark:bg-black",
//           className
//         )}
//       >
//         {navItems.map((navItem, idx) => (
//           <Link
//             key={`link-${idx}`}
//             href={navItem.link}
//             className="relative flex items-center space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
//           >
//             <span className="block sm:hidden">{navItem.icon}</span>
//             <span className="hidden text-sm sm:block">{navItem.name}</span>
//           </Link>
//         ))}

//         {session ? (
//           <button
//             onClick={logout}
//             className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white"
//           >
//             <span>Logout</span>
//             <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
//           </button>
//         ) : (
//           <>
//             <Link
//               href="/login"
//               className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white"
//             >
//               <span>Login</span>
//               <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
//             </Link>

//             <Link
//               href="/register"
//               className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white"
//             >
//               <span>Signup</span>
//               <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
//             </Link>
//           </>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// };

///////////////////////////////////////////////

// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
// } from "framer-motion";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useAuthStore } from "@/store/Auth";
// import { usePathname, useRouter } from "next/navigation";

// type NavItem = {
//   name: string;
//   link: string;
//   icon?: React.ReactNode;
// };

// export const FloatingNav = ({
//   navItems,
//   className,
// }: {
//   navItems: NavItem[];
//   className?: string;
// }) => {
//   const { scrollYProgress, scrollY } = useScroll();
//   const { session, logout } = useAuthStore();
//   const [visible, setVisible] = useState(true);

//   const pathname = usePathname();
//   const router = useRouter();

//   // ✅ active matcher (works for /questions/*, /users/* etc.)
//   const isActive = (href: string) => {
//     if (href === "/") return pathname === "/";
//     return (
//       pathname === href ||
//       pathname.startsWith(href + "/") ||
//       pathname.startsWith(href)
//     );
//   };

//   // ✅ Better show/hide behavior (show at top, hide when scrolling down, show when scrolling up)
//   useMotionValueEvent(scrollYProgress, "change", (current) => {
//     const y = scrollY.get();
//     if (y < 10) {
//       setVisible(true);
//       return;
//     }

//     if (typeof current === "number") {
//       const prev = scrollYProgress.getPrevious() ?? current;
//       const direction = current - prev;
//       setVisible(direction < 0);
//     }
//   });

//   const items = useMemo(() => navItems, [navItems]);

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{ opacity: 1, y: -100 }}
//         animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
//         transition={{ duration: 0.2 }}
//         className={cn(
//           "fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center gap-2 rounded-full",
//           "border border-white/10 bg-white/90 px-2 py-2 shadow-[0px_12px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md",
//           "dark:bg-white",
//           className
//         )}
//       >
//         {items.map((navItem) => {
//           const active = isActive(navItem.link);

//           return (
//             <Link
//               key={navItem.link}
//               href={navItem.link}
//               className={cn(
//                 "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
//                 "active:scale-[0.98]",
//                 active
//                   ? "bg-black text-white shadow-sm"
//                   : "text-black/70 hover:bg-black/10 hover:text-black"
//               )}
//             >
//               <span
//                 className={cn(
//                   "block sm:hidden transition",
//                   active ? "text-white" : "text-black/60 group-hover:text-black"
//                 )}
//               >
//                 {navItem.icon}
//               </span>

//               <span className="hidden sm:block">{navItem.name}</span>

//               {/* ✅ ACTIVE GLOW DOT */}
//               {active && (
//                 <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2">
//                   <span className="block h-1.5 w-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0.20),0_0_18px_rgba(59,130,246,0.70)]" />
//                 </span>
//               )}
//             </Link>
//           );
//         })}

//         {/* Right side actions */}
//         {session ? (
//           <button
//             onClick={async () => {
//               await logout();
//               router.push("/login");
//             }}
//             className={cn(
//               "ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
//               "border border-black/10 bg-white text-black/80",
//               "hover:bg-red-500 hover:text-white",
//               "active:scale-[0.98]"
//             )}
//             type="button"
//           >
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link
//               href="/login"
//               className={cn(
//                 "ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
//                 "border border-black/10 bg-white text-black/80",
//                 "hover:bg-black hover:text-white",
//                 "active:scale-[0.98]"
//               )}
//             >
//               Login
//             </Link>

//             <Link
//               href="/register"
//               className={cn(
//                 "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
//                 "bg-black text-white",
//                 "hover:opacity-90",
//                 "active:scale-[0.98]"
//               )}
//             >
//               Signup
//             </Link>
//           </>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// };

/////////////////////////////////////////////

"use client";

import React, { useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { scrollYProgress, scrollY } = useScroll();
  const { session, logout } = useAuthStore();
  const [visible, setVisible] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  // ✅ active matcher (works for /questions/*, /users/* etc.)
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      pathname.startsWith(href)
    );
  };

  // ✅ show at top, hide when scrolling down, show when scrolling up
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    const y = scrollY.get();
    if (y < 10) {
      setVisible(true);
      return;
    }

    if (typeof current === "number") {
      const prev = scrollYProgress.getPrevious() ?? current;
      const direction = current - prev;
      setVisible(direction < 0);
    }
  });

  const items = useMemo(() => navItems, [navItems]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center gap-2 rounded-full",
          "border border-white/10 bg-white/90 px-2 py-2 shadow-[0px_12px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md",
          "dark:bg-white",
          className
        )}
      >
        {items.map((navItem) => {
          const active = isActive(navItem.link);

          return (
            <Link
              key={navItem.link}
              href={navItem.link}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                "active:scale-[0.98]",
                active
                  ? "bg-black text-white shadow-sm"
                  : "text-black/70 hover:bg-black/10 hover:text-black"
              )}
            >
              <span
                className={cn(
                  "block sm:hidden transition",
                  active ? "text-white" : "text-black/60 group-hover:text-black"
                )}
              >
                {navItem.icon}
              </span>

              <span className="hidden sm:block">{navItem.name}</span>

              {/* ✅ ACTIVE BRAND GRADIENT DOT */}
              {active && (
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2">
                  <span
                    className={cn(
                      "block h-1.5 w-1.5 rounded-full",
                      "bg-gradient-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff]",
                      "shadow-[0_0_0_3px_rgba(255,41,117,0.18),0_0_18px_rgba(140,30,255,0.55)]"
                    )}
                  />
                </span>
              )}
            </Link>
          );
        })}

        {/* Right side actions */}
        {session ? (
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className={cn(
              "ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
              "border border-black/10 bg-white text-black/80",
              "hover:bg-red-500 hover:text-white",
              "active:scale-[0.98]"
            )}
            type="button"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className={cn(
                "ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                "border border-black/10 bg-white text-black/80",
                "hover:bg-black hover:text-white",
                "active:scale-[0.98]"
              )}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                "bg-black text-white",
                "hover:opacity-90",
                "active:scale-[0.98]"
              )}
            >
              Signup
            </Link>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
