// import { Permission } from "node-appwrite";
// import { questionAttachmentBucket } from "../name";
// import { storage } from "./config";

// export default async function getOrCreateStorage() {
//   try {
//     await storage.getBucket(questionAttachmentBucket);
//     console.log("Storage Connected");
//   } catch (error) {
//     try {
//       await storage.createBucket(
//         questionAttachmentBucket,
//         questionAttachmentBucket,
//         [
//           Permission.create("users"),
//           Permission.read("any"),
//           Permission.read("users"),
//           Permission.update("users"),
//           Permission.delete("users"),
//         ],
//         false,
//         undefined,
//         undefined,
//         ["jpg", "png", "gif", "jpeg", "webp", "heic"]
//       );

//       console.log("Storage Created");
//       console.log("Storage Connected");
//     } catch (error) {
//       console.log("Error creating storage:", error);
//     }
//   }
// }

import { Permission, Role } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Connected");
  } catch {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.create(Role.users()),
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );

      console.log("Storage Created");
      console.log("Storage Connected");
    } catch (error) {
      console.log("Error creating storage:", error);
    }
  }
}
