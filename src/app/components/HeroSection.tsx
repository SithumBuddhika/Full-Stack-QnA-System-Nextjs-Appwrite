// import React from "react";
// import { HeroParallax } from "@/components/ui/hero-parallax";
// import { databases } from "@/models/server/config";
// import {
//   db,
//   questionAttachmentBucket,
//   questionCollection,
// } from "@/models/name";
// import { Query } from "node-appwrite";
// import slugify from "@/utils/slugify";
// import { storage } from "@/models/client/config";
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
//         thumbnail: storage.getFilePreview(
//           questionAttachmentBucket,
//           q.attachmentId
//         ),
//       }))}
//     />
//   );
// }

// src/app/components/HeroSection.tsx
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases, storage } from "@/models/server/config"; // ✅ server storage
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.orderDesc("$createdAt"),
    Query.limit(15),
  ]);

  return (
    <HeroParallax
      header={<HeroSectionHeader />}
      products={questions.documents.map((q: any) => ({
        title: q.title,
        link: `/questions/${q.$id}/${slugify(q.title)}`,
        // ✅ server SDK returns URL object OR string depending on version
        thumbnail: String(
          storage.getFilePreview(questionAttachmentBucket, q.attachmentId)
        ),
      }))}
    />
  );
}
