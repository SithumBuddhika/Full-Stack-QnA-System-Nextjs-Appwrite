// import { IndexType, Permission } from "node-appwrite";
// import { answerCollection, db } from "../name";
// import { databases } from "./config";

// export default async function createAnswerCollection() {
//   //create collection
//   await databases.createCollection(db, answerCollection, answerCollection, [
//     Permission.create("users"),
//     Permission.read("any"),
//     Permission.read("users"),
//     Permission.update("users"),
//     Permission.delete("users"),
//   ]);
//   console.log("Answer Collection Created");

//   //creating attributes
//   await Promise.all([
//     databases.createStringAttribute(
//       db,
//       answerCollection,
//       "content",
//       10000,
//       true
//     ),
//     databases.createStringAttribute(
//       db,
//       answerCollection,
//       "questionId",
//       50,
//       true
//     ),
//     databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
//   ]);
//   console.log("Answer Attributes Created");
// }

// import { Permission, Role } from "node-appwrite";
// import { answerCollection, db } from "../name";
// import { databases } from "./config";

// export default async function createAnswerCollection() {
//   // create collection (new signature)
//   await databases.createCollection({
//     databaseId: db,
//     collectionId: answerCollection,
//     name: answerCollection,
//     permissions: [
//       Permission.create(Role.users()),
//       Permission.read(Role.any()),
//       Permission.update(Role.users()),
//       Permission.delete(Role.users()),
//     ],
//     documentSecurity: true,
//     enabled: true,
//   });

//   console.log("Answer Collection Created");

//   // creating attributes
//   await Promise.all([
//     databases.createStringAttribute(
//       db,
//       answerCollection,
//       "content",
//       10000,
//       true
//     ),
//     databases.createStringAttribute(
//       db,
//       answerCollection,
//       "questionId",
//       50,
//       true
//     ),
//     databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
//   ]);

//   console.log("Answer Attributes Created");
// }

import { Permission, Role } from "node-appwrite";
import { answerCollection, db } from "../name";
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

export default async function createAnswerCollection() {
  // 1) collection: create if missing
  try {
    await databases.getCollection(db, answerCollection);
  } catch {
    await databases.createCollection(db, answerCollection, answerCollection, [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]);
    console.log("Answer collection created");
  }

  // 2) attributes: create if missing
  await Promise.all([
    safe(() =>
      databases.createStringAttribute(
        db,
        answerCollection,
        "content",
        10000,
        true
      )
    ),
    safe(() =>
      databases.createStringAttribute(
        db,
        answerCollection,
        "questionId",
        50,
        true
      )
    ),
    safe(() =>
      databases.createStringAttribute(
        db,
        answerCollection,
        "authorId",
        50,
        true
      )
    ),
  ]);

  console.log("Answer attributes ready");
}
