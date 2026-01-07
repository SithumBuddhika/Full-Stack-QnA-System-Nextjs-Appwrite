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

// import { Permission, Role } from "node-appwrite";
// import { questionAttachmentBucket } from "../name";
// import { storage } from "./config";

// export default async function getOrCreateStorage() {
//   try {
//     await storage.getBucket(questionAttachmentBucket);
//     console.log("Storage Connected");
//   } catch {
//     try {
//       await storage.createBucket(
//         questionAttachmentBucket,
//         questionAttachmentBucket,
//         [
//           Permission.create(Role.users()),
//           Permission.read(Role.any()),
//           Permission.update(Role.users()),
//           Permission.delete(Role.users()),
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

// // src/models/server/storageSetup.ts
// import { questionAttachmentBucket } from "../name";
// import { storage } from "./config";

// export default async function getOrCreateStorage() {
//   try {
//     await storage.getBucket(questionAttachmentBucket);
//     console.log("Storage Connected");
//   } catch (error: any) {
//     // DO NOT auto-create buckets (your plan limit reached)
//     console.log(
//       `Storage bucket "${questionAttachmentBucket}" not found or not accessible.`
//     );
//     console.log(
//       "Create it manually in Appwrite Console -> Storage, then restart the dev server."
//     );

//     // Optional: log the real error once (useful for debugging)
//     // console.log("Storage check error:", error?.message || error);
//   }
// }

// // models/server/storageSetup.ts
// import { questionAttachmentBucket } from "../name";
// import { storage } from "./config";

// export default async function getOrCreateStorage() {
//   try {
//     await storage.getBucket(questionAttachmentBucket);
//     console.log("Storage Connected");
//   } catch {
//     console.warn("Bucket not found. Create it manually in Appwrite Console.");
//   }
// }

// src/models/server/storageSetup.ts
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

function isPlanLimit(err: any) {
  const msg = String(err?.message || "");
  const type = String(err?.type || "");
  return (
    msg.includes("maximum number of buckets") ||
    type === "additional_resource_not_allowed" ||
    err?.code === 403
  );
}

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Connected");
  } catch (err: any) {
    // If plan limit reached, don't retry create. Just tell user.
    if (isPlanLimit(err)) {
      console.log(
        "Storage: bucket limit reached on free plan. Use an existing bucket or upgrade."
      );
      return;
    }

    // If bucket doesn't exist (most likely), tell user to create it manually
    console.warn(
      `Storage: Bucket "${questionAttachmentBucket}" not found. Create it manually in Appwrite Console.`
    );
  }
}
