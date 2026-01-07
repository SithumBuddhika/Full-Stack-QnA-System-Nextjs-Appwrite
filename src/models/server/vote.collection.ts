// import { Permission } from "node-appwrite";
// import { db, voteCollection } from "../name";
// import { databases } from "./config";

// export default async function createVoteCollection() {
//   //create collection
//   await databases.createCollection(db, voteCollection, voteCollection, [
//     Permission.create("users"),
//     Permission.read("any"),
//     Permission.read("users"),
//     Permission.update("users"),
//     Permission.delete("users"),
//   ]);
//   console.log("Vote Collection Created");

//   //creating attributes

//   await Promise.all([
//     databases.createEnumAttribute(
//       db,
//       voteCollection,
//       "type",
//       ["question", "answer"],
//       true
//     ),
//     databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
//     databases.createEnumAttribute(
//       db,
//       voteCollection,
//       "voteStatus",
//       ["upvoted", "downvoted"],
//       true
//     ),
//     databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
//   ]);
//   console.log("Vote Attribute Created");
// }

// import { Permission, Role } from "node-appwrite";
// import { db, voteCollection } from "../name";
// import { databases } from "./config";

// export default async function createVoteCollection() {
//   // create collection (new signature)
//   await databases.createCollection({
//     databaseId: db,
//     collectionId: voteCollection,
//     name: voteCollection,
//     permissions: [
//       Permission.create(Role.users()),
//       Permission.read(Role.any()),
//       Permission.update(Role.users()),
//       Permission.delete(Role.users()),
//     ],
//     documentSecurity: true,
//     enabled: true,
//   });

//   console.log("Vote Collection Created");

//   // creating attributes
//   await Promise.all([
//     databases.createEnumAttribute(
//       db,
//       voteCollection,
//       "type",
//       ["question", "answer"],
//       true
//     ),
//     databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
//     databases.createEnumAttribute(
//       db,
//       voteCollection,
//       "voteStatus",
//       ["upvoted", "downvoted"],
//       true
//     ),
//     databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
//   ]);

//   console.log("Vote Attributes Created");
// }

import { Permission, Role } from "node-appwrite";
import { db, voteCollection } from "../name";
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

export default async function createVoteCollection() {
  // 1) collection: create if missing
  try {
    await databases.getCollection(db, voteCollection);
  } catch {
    await databases.createCollection(db, voteCollection, voteCollection, [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]);
    console.log("Vote collection created");
  }

  // 2) attributes: create if missing
  await Promise.all([
    safe(() =>
      databases.createEnumAttribute(
        db,
        voteCollection,
        "type",
        ["question", "answer"],
        true
      )
    ),
    safe(() =>
      databases.createStringAttribute(db, voteCollection, "typeId", 50, true)
    ),
    safe(() =>
      databases.createEnumAttribute(
        db,
        voteCollection,
        "voteStatus",
        ["upvoted", "downvoted"],
        true
      )
    ),
    safe(() =>
      databases.createStringAttribute(db, voteCollection, "votedById", 50, true)
    ),
  ]);

  console.log("Vote attributes ready");
}
