// "use client";

// import { cn } from "@/lib/utils";

// import {
//   CSSProperties,
//   ReactElement,
//   ReactNode,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// interface MousePosition {
//   x: number;
//   y: number;
// }

// function useMousePosition(): MousePosition {
//   const [mousePosition, setMousePosition] = useState<MousePosition>({
//     x: 0,
//     y: 0,
//   });

//   useEffect(() => {
//     const handleMouseMove = (event: globalThis.MouseEvent) => {
//       setMousePosition({ x: event.clientX, y: event.clientY });
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return mousePosition;
// }

// interface MagicContainerProps {
//   children?: ReactNode;
//   className?: any;
// }

// const MagicContainer = ({ children, className }: MagicContainerProps) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mousePosition = useMousePosition();
//   const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
//   const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
//   const [boxes, setBoxes] = useState<Array<HTMLElement>>([]);

//   useEffect(() => {
//     init();
//     containerRef.current &&
//       setBoxes(
//         Array.from(containerRef.current.children).map((el) => el as HTMLElement)
//       );
//   }, []);

//   useEffect(() => {
//     init();
//     window.addEventListener("resize", init);

//     return () => {
//       window.removeEventListener("resize", init);
//     };
//   }, [setBoxes]);

//   useEffect(() => {
//     onMouseMove();
//   }, [mousePosition]);

//   const init = () => {
//     if (containerRef.current) {
//       containerSize.current.w = containerRef.current.offsetWidth;
//       containerSize.current.h = containerRef.current.offsetHeight;
//     }
//   };

//   const onMouseMove = () => {
//     if (containerRef.current) {
//       const rect = containerRef.current.getBoundingClientRect();
//       const { w, h } = containerSize.current;
//       const x = mousePosition.x - rect.left;
//       const y = mousePosition.y - rect.top;
//       const inside = x < w && x > 0 && y < h && y > 0;

//       mouse.current.x = x;
//       mouse.current.y = y;
//       boxes.forEach((box) => {
//         const boxX =
//           -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
//         const boxY =
//           -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
//         box.style.setProperty("--mouse-x", `${boxX}px`);
//         box.style.setProperty("--mouse-y", `${boxY}px`);

//         if (inside) {
//           box.style.setProperty("--opacity", `1`);
//         } else {
//           box.style.setProperty("--opacity", `0`);
//         }
//       });
//     }
//   };

//   return (
//     <div className={cn("h-full w-full", className)} ref={containerRef}>
//       {children}
//     </div>
//   );
// };

// interface MagicCardProps {
//   /**
//    * @default <div />
//    * @type ReactElement
//    * @description
//    * The component to be rendered as the card
//    * */
//   as?: ReactElement;
//   /**
//    * @default ""
//    * @type string
//    * @description
//    * The className of the card
//    */
//   className?: string;

//   /**
//    * @default ""
//    * @type ReactNode
//    * @description
//    * The children of the card
//    * */
//   children?: ReactNode;

//   /**
//    * @default 600
//    * @type number
//    * @description
//    * The size of the spotlight effect in pixels
//    * */
//   size?: number;

//   /**
//    * @default true
//    * @type boolean
//    * @description
//    * Whether to show the spotlight
//    * */
//   spotlight?: boolean;

//   /**
//    * @default "rgba(255,255,255,0.03)"
//    * @type string
//    * @description
//    * The color of the spotlight
//    * */
//   spotlightColor?: string;

//   /**
//    * @default true
//    * @type boolean
//    * @description
//    * Whether to isolate the card which is being hovered
//    * */
//   isolated?: boolean;

//   /**
//    * @default "rgba(255,255,255,0.03)"
//    * @type string
//    * @description
//    * The background of the card
//    * */
//   background?: string;

//   [key: string]: any;
// }

// const MagicCard: React.FC<MagicCardProps> = ({
//   className,
//   children,
//   size = 600,
//   spotlight = true,
//   borderColor = "hsl(0 0% 98%)",
//   isolated = true,
//   ...props
// }) => {
//   return (
//     <div
//       style={
//         {
//           "--mask-size": `${size}px`,
//           "--border-color": `${borderColor}`,
//         } as CSSProperties
//       }
//       className={cn(
//         "relative z-0 h-full w-full rounded-2xl p-6",
//         "bg-gray-300 dark:bg-gray-700",
//         "bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--border-color),transparent_100%)]",
//         className
//       )}
//       {...props}
//     >
//       {children}

//       {/* Background */}
//       <div
//         className={
//           "absolute inset-[1px] -z-20 rounded-2xl bg-white dark:bg-black/95"
//         }
//       />
//     </div>
//   );
// };

// export { MagicCard, MagicContainer };

// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";

// type MagicContainerProps = React.HTMLAttributes<HTMLDivElement>;

// /**
//  * Wrapper container (the tutorial expects this export).
//  * You can layout it however you want (flex/grid).
//  */
// export function MagicContainer({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return <div className={className}>{children}</div>;
// }

// type MagicCardProps = React.HTMLAttributes<HTMLDivElement>;

// /**
//  * A card with a "magic" hover glow that follows the mouse.
//  * Exported as MagicCard (tutorial expects this name).
//  */
// export function MagicCard({ className, ...props }: MagicCardProps) {
//   const ref = React.useRef<HTMLDivElement>(null);

//   function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = ref.current;
//     if (!el) return;

//     const rect = el.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     el.style.setProperty("--mx", `${x}px`);
//     el.style.setProperty("--my", `${y}px`);
//   }

//   return (
//     <div
//       ref={ref}
//       onMouseMove={onMouseMove}
//       className={cn(
//         "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
//         "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
//         "before:[background:radial-gradient(600px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.12),transparent_40%)]",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";

// /**
//  * Simple wrapper container used by pages like the user profile summary.
//  * (Your code imports { MagicContainer } from "@/components/ui/magic-card")
//  */
// export function MagicContainer({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return <div className={cn(className)}>{children}</div>;
// }

// /**
//  * A "glow/magic" card.
//  * This version is intentionally dependency-free (no framer-motion),
//  * so it will never break your build due to missing exports.
//  */
// export function MagicCard({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div
//       className={cn(
//         "relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md",
//         "overflow-hidden",
//         className
//       )}
//     >
//       {/* subtle glow layer */}
//       <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(600px_circle_at_50%_30%,rgba(120,119,198,0.25),transparent_60%)]" />
//       {/* content */}
//       <div className="relative z-10">{children}</div>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function MagicCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
        "overflow-hidden",
        className
      )}
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)] bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.25),transparent_70%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
