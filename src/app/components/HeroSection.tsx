import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases, storage } from "@/models/server/config";
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
    Query.limit(30), // fetch more, then filter
  ]);

  // ✅ ONLY include questions that have an attachmentId
  const withImages = questions.documents.filter((q: any) => !!q.attachmentId);

  // take first 15
  const sliced = withImages.slice(0, 15);

  const products = sliced.map((q: any) => {
    const title = String(q.title ?? "Untitled");
    const id = String(q.$id ?? "");
    const link = `/questions/${id}/${slugify(title)}`;

    // ✅ IMPORTANT: use file VIEW (no transformations)
    const thumbnail = String(
      storage.getFileView(questionAttachmentBucket, String(q.attachmentId))
    );

    return { id, title, link, thumbnail };
  });

  return <HeroParallax header={<HeroSectionHeader />} products={products} />;
}
