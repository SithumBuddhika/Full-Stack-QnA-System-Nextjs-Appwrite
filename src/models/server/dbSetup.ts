// import { db } from "../name";
// import createAnswerCollection from "./answer.collection";
// import createCommentCollection from "./comment.collection";
// import createQuestionCollection from "./question.collection";
// import createVoteCollection from "./vote.collection";

// import { databases } from "./config";

// export default async function fetOrCreateDB() {
//   try {
//     await databases.get(db);
//     console.log("Database connection");
//   } catch (error) {
//     try {
//       await databases.create(db, db);
//       console.log("database created");
//       //create collections
//       await Promise.all([
//         createQuestionCollection(),
//         createAnswerCollection(),
//         createCommentCollection(),
//         createVoteCollection(),
//       ]);
//       console.log("Collection created");
//       console.log("Database connected");
//     } catch (error) {
//       console.log("Error creating databases or collection", error);
//     }
//   }
//   return databases;
// }

// import { db } from "../name";
// import createAnswerCollection from "./answer.collection";
// import createCommentCollection from "./comment.collection";
// import createQuestionCollection from "./question.collection";
// import createVoteCollection from "./vote.collection";
// import { databases } from "./config";

// export default async function getOrCreateDB() {
//   // 1) ensure DB exists
//   try {
//     await databases.get(db);
//     console.log("Database connected");
//   } catch {
//     await databases.create(db, db);
//     console.log("Database created");
//   }

//   // 2) ensure collections exist (try create; ignore "already exists")
//   const tasks = [
//     createQuestionCollection(),
//     createAnswerCollection(),
//     createCommentCollection(),
//     createVoteCollection(),
//   ];

//   await Promise.allSettled(tasks);

//   console.log("Database ready");
//   return databases;
// }

// // src/models/server/dbSetup.ts
// import { db } from "../name";
// import createAnswerCollection from "./answer.collection";
// import createCommentCollection from "./comment.collection";
// import createQuestionCollection from "./question.collection";
// import createVoteCollection from "./vote.collection";
// import { databases } from "./config";

// export default async function getOrCreateDB() {
//   // 1) ensure DB exists
//   try {
//     await databases.get(db);
//     console.log("Database connected");
//   } catch (error: any) {
//     try {
//       await databases.create(db, db);
//       console.log("Database created");
//     } catch (createErr: any) {
//       console.log("Database create failed:", createErr?.message || createErr);
//     }
//   }

//   // 2) ensure collections exist
//   const tasks = [
//     createQuestionCollection(),
//     createAnswerCollection(),
//     createCommentCollection(),
//     createVoteCollection(),
//   ];

//   const results = await Promise.allSettled(tasks);

//   // Optional: log failed collection creates (but don't crash)
//   results.forEach((r, i) => {
//     if (r.status === "rejected") {
//       console.log(
//         `Collection setup failed [${i}]:`,
//         (r.reason as any)?.message || r.reason
//       );
//     }
//   });

//   console.log("Database ready");
//   return databases;
// }

// src/models/server/dbSetup.ts
import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

function isAlreadyExists(err: any) {
  const msg = String(err?.message || "");
  return msg.includes("already exists") || err?.code === 409;
}

export default async function getOrCreateDB() {
  // 1) ensure DB exists
  try {
    await databases.get(db);
    console.log("Database connected");
  } catch (error: any) {
    try {
      await databases.create(db, db);
      console.log("Database created");
    } catch (createErr: any) {
      // If it already exists due to race condition, ignore
      if (!isAlreadyExists(createErr)) {
        console.log("Database create failed:", createErr?.message || createErr);
      } else {
        console.log("Database connected");
      }
    }
  }

  // 2) ensure collections/attributes exist
  const tasks = [
    createQuestionCollection(),
    createAnswerCollection(),
    createCommentCollection(),
    createVoteCollection(),
  ];

  const results = await Promise.allSettled(tasks);

  // Log only real failures
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const reason: any = r.reason;
      if (!isAlreadyExists(reason)) {
        console.log(
          `Collection setup failed [${i}]:`,
          reason?.message || reason
        );
      }
    }
  });

  console.log("Database ready");
  return databases;
}
