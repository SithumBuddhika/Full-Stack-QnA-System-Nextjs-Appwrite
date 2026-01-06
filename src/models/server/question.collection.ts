// // import { Permission } from "node-appwrite"

// // import {db, questionCollection} from "../name"
// // import {databases} from "./config"

// // export default async function createQuestionCollection(){
// //     //create collection
// //     await databases.createCollection(db, questionCollection,
// //     questionCollection, [
// //         Permission.read("any"),
// //         Permission.read("users"),
// //         Permission.create("users"),
// //         Permission.update("users"),
// //         Permission.delete("users")

// //     ])
// //     console.log("Question collection is created")
// // }

// import { IndexType, Permission } from "node-appwrite";
// import { db, questionCollection } from "../name";
// import { databases } from "./config";

// export default async function createQuestionCollection() {
//   // create collection using the modern Object-based signature
//   await databases.createCollection({
//     databaseId: db, // string from name.ts
//     collectionId: questionCollection, // string from name.ts
//     name: questionCollection, // actual display name
//     permissions: [
//       // array of permissions
//       Permission.read("any"),
//       Permission.read("users"),
//       Permission.create("users"),
//       Permission.update("users"),
//       Permission.delete("users"),
//     ],
//   });

//   console.log("Question collection is created");

//   //creating attributes and Indexes

//   await Promise.all([
//     databases.createStringAttribute(db, questionCollection, "title", 100, true),
//     databases.createStringAttribute(
//       db,
//       questionCollection,
//       "content",
//       10000,
//       true
//     ),
//     databases.createStringAttribute(
//       db,
//       questionCollection,
//       "authorId",
//       50,
//       true
//     ),
//     databases.createStringAttribute(
//       db,
//       questionCollection,
//       "tags",
//       50,
//       true,
//       undefined,
//       true
//     ),
//     databases.createStringAttribute(
//       db,
//       questionCollection,
//       "attachmentId",
//       50,
//       false
//     ),
//   ]);
//   console.log("Question Attributes created");

//   //create Indexes

//   // await Promise.all([
//   //   databases.createIndex(
//   //     db,
//   //     questionCollection,
//   //     "title",
//   //     IndexType.Fulltext,
//   //     ["title"],
//   //     ["asc"]
//   //   ),

//   //   databases.createIndex(
//   //     db,
//   //     questionCollection,
//   //     "content",
//   //     IndexType.Fulltext,
//   //     ["content"],
//   //     ["asc"]
//   //   ),
//   // ]);
// }

import { IndexType, Permission, Role } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection({
    databaseId: db,
    collectionId: questionCollection,
    name: questionCollection,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    documentSecurity: true,
    enabled: true,
  });

  console.log("Question collection is created");

  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);

  console.log("Question Attributes created");

  // indexes optional
}
