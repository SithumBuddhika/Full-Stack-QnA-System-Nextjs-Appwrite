// "use client";
// import { useAuthStore } from "@/store/Auth";
// import { useRouter } from "next/router";
// import React from "react";

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   const { session } = useAuthStore();
//   const router = useRouter();

//   React.useEffect(() => {
//     if (session) {
//       router.push("/");
//     }
//   }, [session, router]);

//   if (session) {
//     return null;
//   }

//   return (
//     <div className="">
//       <div className="">{children}</div>
//     </div>
//   );
// };

// export default Layout;

// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquierly",
  description: "Ask questions, share knowledge, and collaborate.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
