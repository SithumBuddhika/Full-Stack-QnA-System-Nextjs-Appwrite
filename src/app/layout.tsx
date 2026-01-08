// // src/app/layout.tsx
// import "./globals.css";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Inquierly",
//   description: "Ask questions, share knowledge, and collaborate.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-black text-white antialiased">
//         {children}
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
