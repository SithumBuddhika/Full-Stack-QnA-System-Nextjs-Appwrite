// import { Permission } from "node-appwrite";
// import { db, commentCollection } from "../name";
// import { databases } from "./config";

// export default async function createCommentCollection() {
//   // create collection
//   await databases.createCollection(db, commentCollection, commentCollection, [
//     Permission.create("users"),
//     Permission.read("any"),
//     Permission.read("users"),
//     Permission.update("users"),
//     Permission.delete("users"),
//   ]);
//   console.log("Comment Collection Created");

//   // creating attributes
//   await Promise.all([
//     databases.createStringAttribute(
//       db,
//       commentCollection,
//       "content",
//       10000,
//       true
//     ),
//     databases.createEnumAttribute(
//       db,
//       commentCollection,
//       "type",
//       ["answer", "question"],
//       true
//     ),
//     databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
//     databases.createStringAttribute(
//       db,
//       commentCollection,
//       "authorId",
//       50,
//       true
//     ),
//   ]);
//   console.log("comment Attribute Created");
// }

// import { Permission, Role } from "node-appwrite";
// import { db, commentCollection } from "../name";
// import { databases } from "./config";

// export default async function createCommentCollection() {
//   // create collection (new signature)
//   await databases.createCollection({
//     databaseId: db,
//     collectionId: commentCollection,
//     name: commentCollection,
//     permissions: [
//       Permission.create(Role.users()),
//       Permission.read(Role.any()),
//       Permission.update(Role.users()),
//       Permission.delete(Role.users()),
//     ],
//     documentSecurity: true,
//     enabled: true,
//   });

//   console.log("Comment Collection Created");

//   // creating attributes
//   await Promise.all([
//     databases.createStringAttribute(
//       db,
//       commentCollection,
//       "content",
//       10000,
//       true
//     ),
//     databases.createEnumAttribute(
//       db,
//       commentCollection,
//       "type",
//       ["answer", "question"],
//       true
//     ),
//     databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
//     databases.createStringAttribute(
//       db,
//       commentCollection,
//       "authorId",
//       50,
//       true
//     ),
//   ]);

//   console.log("Comment Attributes Created");
// }

import { Permission, Role } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

function isAlreadyExists(err: any) {
  const msg = String(err?.message || "");
  return msg.includes("already exists") || err?.code === 409;
}

async function safe<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (err: any) {
    if (isAlreadyExists(err)) return null as any;
    throw err;
  }
}

export default async function createCommentCollection() {
  // 1) collection: create if missing
  try {
    await databases.getCollection(db, commentCollection);
  } catch {
    await databases.createCollection(db, commentCollection, commentCollection, [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]);
    console.log("Comment collection created");
  }

  // 2) attributes: create if missing
  await Promise.all([
    safe(() =>
      databases.createStringAttribute(
        db,
        commentCollection,
        "content",
        10000,
        true
      )
    ),
    safe(() =>
      databases.createEnumAttribute(
        db,
        commentCollection,
        "type",
        ["answer", "question"],
        true
      )
    ),
    safe(() =>
      databases.createStringAttribute(db, commentCollection, "typeId", 50, true)
    ),
    safe(() =>
      databases.createStringAttribute(
        db,
        commentCollection,
        "authorId",
        50,
        true
      )
    ),
  ]);

  console.log("Comment attributes ready");
}
