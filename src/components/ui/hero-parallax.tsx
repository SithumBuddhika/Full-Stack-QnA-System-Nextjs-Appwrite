// "use client";
// import React from "react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useSpring,
//   MotionValue,
// } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// export const HeroParallax = ({
//   products,
//   header,
// }: {
//   header: React.ReactNode;
//   products: {
//     title: string;
//     link: string;
//     thumbnail: string;
//   }[];
// }) => {
//   const firstRow = products.slice(0, 5);
//   const secondRow = products.slice(5, 10);
//   const thirdRow = products.slice(10, 15);
//   const ref = React.useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });

//   const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

//   const translateX = useSpring(
//     useTransform(scrollYProgress, [0, 1], [0, 1000]),
//     springConfig
//   );
//   const translateXReverse = useSpring(
//     useTransform(scrollYProgress, [0, 1], [0, -1000]),
//     springConfig
//   );
//   const rotateX = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [15, 0]),
//     springConfig
//   );
//   const opacity = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
//     springConfig
//   );
//   const rotateZ = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [20, 0]),
//     springConfig
//   );
//   const translateY = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
//     springConfig
//   );
//   return (
//     <div
//       ref={ref}
//       className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
//     >
//       {header}
//       <motion.div
//         style={{
//           rotateX,
//           rotateZ,
//           translateY,
//           opacity,
//         }}
//         className=""
//       >
//         <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
//           {firstRow.map((product) => (
//             <ProductCard
//               product={product}
//               translate={translateX}
//               key={product.title}
//             />
//           ))}
//         </motion.div>
//         <motion.div className="mb-20 flex flex-row space-x-20">
//           {secondRow.map((product) => (
//             <ProductCard
//               product={product}
//               translate={translateXReverse}
//               key={product.title}
//             />
//           ))}
//         </motion.div>
//         <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
//           {thirdRow.map((product) => (
//             <ProductCard
//               product={product}
//               translate={translateX}
//               key={product.title}
//             />
//           ))}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export const ProductCard = ({
//   product,
//   translate,
// }: {
//   product: {
//     title: string;
//     link: string;
//     thumbnail: string;
//   };
//   translate: MotionValue<number>;
// }) => {
//   return (
//     <motion.div
//       style={{
//         x: translate,
//       }}
//       whileHover={{
//         y: -20,
//       }}
//       key={product.title}
//       className="group/product relative h-96 w-[30rem] flex-shrink-0"
//     >
//       <Link
//         href={product.link}
//         className="block group-hover/product:shadow-2xl"
//       >
//         <Image
//           src={product.thumbnail}
//           height="600"
//           width="600"
//           className="absolute inset-0 h-full w-full object-cover object-left-top"
//           alt={product.title}
//         />
//       </Link>
//       <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80"></div>
//       <h2 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
//         {product.title}
//       </h2>
//     </motion.div>
//   );
// };

// "use client";

// import React from "react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useSpring,
//   MotionValue,
// } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// type Product = {
//   id?: string; // ✅ allow id (best key)
//   title: string;
//   link: string;
//   thumbnail: string; // must be a valid image src
// };

// function safeImageSrc(src: unknown) {
//   // Next/Image accepts ONLY:
//   // - absolute URL (http/https)
//   // - or "/path"
//   // Everything else becomes placeholder.
//   if (!src) return "/placeholder.png";

//   if (typeof src === "string") {
//     if (src.startsWith("http://") || src.startsWith("https://")) return src;
//     if (src.startsWith("/")) return src;
//     return "/placeholder.png";
//   }

//   // URL object (some SDKs return this)
//   if (typeof src === "object" && src !== null) {
//     const href = (src as any).href;
//     if (typeof href === "string") return safeImageSrc(href);

//     try {
//       const s = String(src);
//       return safeImageSrc(s);
//     } catch {
//       return "/placeholder.png";
//     }
//   }

//   try {
//     return safeImageSrc(String(src));
//   } catch {
//     return "/placeholder.png";
//   }
// }

// function getKey(p: Product, idx: number) {
//   return p.id || p.link || `${p.title}-${idx}`;
// }

// export const HeroParallax = ({
//   products,
//   header,
// }: {
//   header: React.ReactNode;
//   products: Product[];
// }) => {
//   // ✅ sanitize thumbnails once
//   const normalized = React.useMemo(() => {
//     return products.map((p) => ({
//       ...p,
//       thumbnail: safeImageSrc(p.thumbnail),
//     }));
//   }, [products]);

//   const firstRow = normalized.slice(0, 5);
//   const secondRow = normalized.slice(5, 10);
//   const thirdRow = normalized.slice(10, 15);

//   const ref = React.useRef<HTMLDivElement | null>(null);

//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });

//   const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

//   const translateX = useSpring(
//     useTransform(scrollYProgress, [0, 1], [0, 1000]),
//     springConfig
//   );

//   const translateXReverse = useSpring(
//     useTransform(scrollYProgress, [0, 1], [0, -1000]),
//     springConfig
//   );

//   const rotateX = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [15, 0]),
//     springConfig
//   );

//   const opacity = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
//     springConfig
//   );

//   const rotateZ = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [20, 0]),
//     springConfig
//   );

//   const translateY = useSpring(
//     useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
//     springConfig
//   );

//   return (
//     <div
//       ref={ref}
//       className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
//     >
//       {header}

//       <motion.div
//         style={{
//           rotateX,
//           rotateZ,
//           translateY,
//           opacity,
//         }}
//       >
//         <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
//           {firstRow.map((product, idx) => (
//             <ProductCard
//               product={product}
//               translate={translateX}
//               key={getKey(product, idx)}
//               priority={idx < 2} // ✅ load first 2 faster
//             />
//           ))}
//         </motion.div>

//         <motion.div className="mb-20 flex flex-row space-x-20">
//           {secondRow.map((product, idx) => (
//             <ProductCard
//               product={product}
//               translate={translateXReverse}
//               key={getKey(product, idx + 1000)}
//             />
//           ))}
//         </motion.div>

//         <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
//           {thirdRow.map((product, idx) => (
//             <ProductCard
//               product={product}
//               translate={translateX}
//               key={getKey(product, idx + 2000)}
//             />
//           ))}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export const ProductCard = ({
//   product,
//   translate,
//   priority = false,
// }: {
//   product: Product;
//   translate: MotionValue<number>;
//   priority?: boolean;
// }) => {
//   const imgSrc = safeImageSrc(product.thumbnail);

//   return (
//     <motion.div
//       style={{ x: translate }}
//       whileHover={{ y: -20 }}
//       className="group/product relative h-96 w-[30rem] flex-shrink-0"
//     >
//       <Link
//         href={product.link}
//         className="block h-full w-full group-hover/product:shadow-2xl"
//       >
//         <Image
//           src={imgSrc}
//           alt={product.title}
//           fill
//           sizes="(max-width: 768px) 90vw, 480px"
//           priority={priority}
//           className="absolute inset-0 h-full w-full object-cover object-left-top"
//         />
//       </Link>

//       <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 transition group-hover/product:opacity-80" />

//       <h2 className="absolute bottom-4 left-4 text-white opacity-0 transition group-hover/product:opacity-100">
//         {product.title}
//       </h2>
//     </motion.div>
//   );
// };

"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string; // ✅ required
  title: string;
  link: string;
  thumbnail: string; // ✅ must be a valid src string
};

function safeImageSrc(src: unknown) {
  const s = String(src || "");
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))
    return s;
  return "/placeholder.png";
}

export const HeroParallax = ({
  products,
  header,
}: {
  header: React.ReactNode;
  products: Product[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      {header}

      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>

        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              translate={translateXReverse}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  const imgSrc = safeImageSrc(product.thumbnail);

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product relative h-96 w-[30rem] flex-shrink-0"
    >
      <Link href={product.link} className="block h-full w-full">
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 90vw, 480px"
          className="absolute inset-0 object-cover object-left-top"
        />
      </Link>

      <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition group-hover/product:opacity-80" />
      <h2 className="absolute bottom-4 left-4 text-white opacity-0 transition group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
};
