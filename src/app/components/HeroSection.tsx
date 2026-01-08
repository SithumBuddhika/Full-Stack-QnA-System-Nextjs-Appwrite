// // src/app/components/HeroSection.tsx
// import React from "react";
// import { HeroParallax } from "@/components/ui/hero-parallax";
// import { databases, storage } from "@/models/server/config"; // ✅ server storage
// import {
//   db,
//   questionAttachmentBucket,
//   questionCollection,
// } from "@/models/name";
// import { Query } from "node-appwrite";
// import slugify from "@/utils/slugify";
// import HeroSectionHeader from "./HeroSectionHeader";

// export default async function HeroSection() {
//   const questions = await databases.listDocuments(db, questionCollection, [
//     Query.orderDesc("$createdAt"),
//     Query.limit(15),
//   ]);

//   return (
//     <HeroParallax
//       header={<HeroSectionHeader />}
//       products={questions.documents.map((q: any) => ({
//         title: q.title,
//         link: `/questions/${q.$id}/${slugify(q.title)}`,
//         // ✅ server SDK returns URL object OR string depending on version
//         thumbnail: String(
//           storage.getFilePreview(questionAttachmentBucket, q.attachmentId)
//         ),
//       }))}
//     />
//   );
// }

// import React from "react";
// import { HeroParallax } from "@/components/ui/hero-parallax";
// import { databases, storage } from "@/models/server/config"; // ✅ node-appwrite (server)
// import {
//   db,
//   questionAttachmentBucket,
//   questionCollection,
// } from "@/models/name";
// import { Query } from "node-appwrite";
// import slugify from "@/utils/slugify";
// import HeroSectionHeader from "./HeroSectionHeader";

// /**
//  * ✅ Converts Appwrite preview result to a STRING always.
//  * - Some SDKs return a URL object { href }
//  * - Some return a string
//  * - Some return a URL-like object without href
//  */
// function toUrlString(preview: unknown): string {
//   if (!preview) return "";
//   if (typeof preview === "string") return preview;

//   // URL object
//   if (typeof preview === "object" && preview !== null) {
//     const maybeHref = (preview as any).href;
//     if (typeof maybeHref === "string") return maybeHref;

//     // fallback: try toString()
//     try {
//       const s = String(preview);
//       return s === "[object Object]" ? "" : s;
//     } catch {
//       return "";
//     }
//   }

//   try {
//     const s = String(preview);
//     return s === "[object Object]" ? "" : s;
//   } catch {
//     return "";
//   }
// }

// export default async function HeroSection() {
//   const questions = await databases.listDocuments(db, questionCollection, [
//     Query.orderDesc("$createdAt"),
//     Query.limit(15),
//   ]);

//   const products = questions.documents.map((q: any) => {
//     const previewRaw = q?.attachmentId
//       ? storage.getFilePreview(questionAttachmentBucket, q.attachmentId)
//       : "";

//     const thumbnail = toUrlString(previewRaw) || "/placeholder.png";

//     return {
//       id: q.$id, // ✅ unique id (we will use this in hero-parallax keys)
//       title: q.title,
//       link: `/questions/${q.$id}/${slugify(q.title)}`,
//       thumbnail,
//     };
//   });

//   return <HeroParallax header={<HeroSectionHeader />} products={products} />;
// }

import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases } from "@/models/server/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/server/config"; // ✅ server storage (node-appwrite)
import HeroSectionHeader from "./HeroSectionHeader";

function safeUrl(url: unknown) {
  const s = String(url || "");
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))
    return s;
  return "/placeholder.png";
}

export default async function HeroSection() {
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.orderDesc("$createdAt"),
    Query.limit(15),
  ]);

  const products = questions.documents.map((q: any) => {
    const title = String(q.title ?? "Untitled");
    const id = String(q.$id ?? `${title}-${Math.random()}`);
    const link = `/questions/${id}/${slugify(title)}`;

    // ✅ use VIEW (no transformation), fallback to placeholder
    const thumbnail = q.attachmentId
      ? safeUrl(storage.getFileView(questionAttachmentBucket, q.attachmentId))
      : "/placeholder.png";

    return { id, title, link, thumbnail };
  });

  return <HeroParallax header={<HeroSectionHeader />} products={products} />;
}
