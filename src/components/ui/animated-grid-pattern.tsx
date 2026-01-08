// "use client";

// import {
//   ComponentPropsWithoutRef,
//   useEffect,
//   useId,
//   useRef,
//   useState,
// } from "react";
// import { motion } from "motion/react";

// import { cn } from "@/lib/utils";

// export interface AnimatedGridPatternProps
//   extends ComponentPropsWithoutRef<"svg"> {
//   width?: number;
//   height?: number;
//   x?: number;
//   y?: number;
//   strokeDasharray?: number;
//   numSquares?: number;
//   maxOpacity?: number;
//   duration?: number;
//   repeatDelay?: number;
// }

// export function AnimatedGridPattern({
//   width = 40,
//   height = 40,
//   x = -1,
//   y = -1,
//   strokeDasharray = 0,
//   numSquares = 50,
//   className,
//   maxOpacity = 0.5,
//   duration = 4,
//   ...props
// }: AnimatedGridPatternProps) {
//   const id = useId();
//   const containerRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
//   const [squares, setSquares] = useState(() => generateSquares(numSquares));

//   function getPos() {
//     return [
//       Math.floor((Math.random() * dimensions.width) / width),
//       Math.floor((Math.random() * dimensions.height) / height),
//     ];
//   }

//   // Adjust the generateSquares function to return objects with an id, x, and y
//   function generateSquares(count: number) {
//     return Array.from({ length: count }, (_, i) => ({
//       id: i,
//       pos: getPos(),
//     }));
//   }

//   // Function to update a single square's position
//   const updateSquarePosition = (id: number) => {
//     setSquares((currentSquares) =>
//       currentSquares.map((sq) =>
//         sq.id === id
//           ? {
//               ...sq,
//               pos: getPos(),
//             }
//           : sq
//       )
//     );
//   };

//   // Update squares to animate in
//   useEffect(() => {
//     if (dimensions.width && dimensions.height) {
//       setSquares(generateSquares(numSquares));
//     }
//   }, [dimensions, numSquares, generateSquares]);

//   // Resize observer to update container dimensions
//   useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         setDimensions({
//           width: entry.contentRect.width,
//           height: entry.contentRect.height,
//         });
//       }
//     });

//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     return () => {
//       if (containerRef.current) {
//         resizeObserver.unobserve(containerRef.current);
//       }
//     };
//   }, [containerRef]);

//   return (
//     <svg
//       ref={containerRef}
//       aria-hidden="true"
//       className={cn(
//         "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
//         className
//       )}
//       {...props}
//     >
//       <defs>
//         <pattern
//           id={id}
//           width={width}
//           height={height}
//           patternUnits="userSpaceOnUse"
//           x={x}
//           y={y}
//         >
//           <path
//             d={`M.5 ${height}V.5H${width}`}
//             fill="none"
//             strokeDasharray={strokeDasharray}
//           />
//         </pattern>
//       </defs>
//       <rect width="100%" height="100%" fill={`url(#${id})`} />
//       <svg x={x} y={y} className="overflow-visible">
//         {squares.map(({ pos: [x, y], id }, index) => (
//           <motion.rect
//             initial={{ opacity: 0 }}
//             animate={{ opacity: maxOpacity }}
//             transition={{
//               duration,
//               repeat: 1,
//               delay: index * 0.1,
//               repeatType: "reverse",
//             }}
//             onAnimationComplete={() => updateSquarePosition(id)}
//             key={`${x}-${y}-${index}`}
//             width={width - 1}
//             height={height - 1}
//             x={x * width + 1}
//             y={y * height + 1}
//             fill="currentColor"
//             strokeWidth="0"
//           />
//         ))}
//       </svg>
//     </svg>
//   );
// }

"use client";

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SvgProps = Omit<ComponentPropsWithoutRef<"svg">, "width" | "height">;

export interface AnimatedGridPatternProps extends SvgProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  /** ✅ allowed prop but MUST NOT reach the DOM */
  repeatDelay?: number;
}

type Square = { id: number; pos: [number, number] };

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.25, // ✅ default
  ...rest
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // ✅ IMPORTANT: do NOT pass repeatDelay to DOM
  const { repeatDelay: _omitRepeatDelay, ...props } = rest as any;

  // stable random position based on current measured size
  const getPos = useMemo(() => {
    return () => {
      const w = dimensions.width || 1;
      const h = dimensions.height || 1;

      return [
        Math.floor((Math.random() * w) / width),
        Math.floor((Math.random() * h) / height),
      ] as [number, number];
    };
  }, [dimensions.width, dimensions.height, width, height]);

  const generateSquares = useMemo(() => {
    return (count: number): Square[] =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      }));
  }, [getPos]);

  const [squares, setSquares] = useState<Square[]>(() => []);

  const updateSquarePosition = (squareId: number) => {
    setSquares((current) =>
      current.map((sq) => (sq.id === squareId ? { ...sq, pos: getPos() } : sq))
    );
  };

  // ✅ ResizeObserver (stable + safe cleanup)
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // ✅ When dimensions become available OR numSquares changes, generate initial squares
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    setSquares(generateSquares(numSquares));
  }, [dimensions.width, dimensions.height, numSquares, generateSquares]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id})`} />

      <svg x={x} y={y} className="overflow-visible">
        {squares.map((sq, index) => {
          const [sx, sy] = sq.pos;

          return (
            <motion.rect
              key={sq.id}
              width={width - 1}
              height={height - 1}
              x={sx * width + 1}
              y={sy * height + 1}
              fill="currentColor"
              strokeWidth="0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, maxOpacity, 0] }}
              transition={{
                duration,
                repeat: Infinity,
                repeatDelay,
                delay: index * 0.04,
                ease: "easeInOut",
              }}
              onAnimationComplete={() => updateSquarePosition(sq.id)}
            />
          );
        })}
      </svg>
    </svg>
  );
}

export default AnimatedGridPattern;
