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

import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB() {
  // 1) ensure DB exists
  try {
    await databases.get(db);
    console.log("Database connected");
  } catch {
    await databases.create(db, db);
    console.log("Database created");
  }

  // 2) ensure collections exist (try create; ignore "already exists")
  const tasks = [
    createQuestionCollection(),
    createAnswerCollection(),
    createCommentCollection(),
    createVoteCollection(),
  ];

  await Promise.allSettled(tasks);

  console.log("Database ready");
  return databases;
}
