// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import getOrCreateDB from "./models/server/dbSetup";
// import getOrCreateStorage from "./models/server/storageSetup";

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   /*match all request paths except for the ones that starts with:
//   -api
//   -_next/static
//   -_next/image
//   -favicon.ico

//   */
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import getOrCreateDB from "./models/server/dbSetup";
// import getOrCreateStorage from "./models/server/storageSetup";

// export async function middleware(request: NextRequest) {
//   // ✅ Run setup checks only in development (optional)
//   if (process.env.NODE_ENV === "development") {
//     await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import getOrCreateDB from "./models/server/dbSetup";
// import getOrCreateStorage from "./models/server/storageSetup";

// let didRunSetup = false;

// export async function middleware(_request: NextRequest) {
//   if (process.env.NODE_ENV === "development" && !didRunSetup) {
//     didRunSetup = true;
//     await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import getOrCreateDB from "./models/server/dbSetup";

// export async function middleware(_: NextRequest) {
//   if (process.env.NODE_ENV === "development") {
//     await getOrCreateDB(); // DB only
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
