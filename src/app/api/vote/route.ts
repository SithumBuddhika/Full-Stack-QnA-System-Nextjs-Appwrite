// import {
//   answerCollection,
//   db,
//   questionCollection,
//   voteCollection,
// } from "@/models/name";
// import { databases, users } from "@/models/server/config";
// import { UserPrefs } from "@/store/Auth";
// import { NextRequest, NextResponse } from "next/server";
// import { ID, Query } from "node-appwrite";

// export async function POST(request: NextRequest) {
//   try {
//     const { votedById, voteStatus, type, typeId } = await request.json();

//     const response = await databases.listDocuments(db, voteCollection, [
//       Query.equal("type", type),
//       Query.equal("typeId", typeId),
//       Query.equal("votedById", votedById),
//     ]);

//     if (response.documents.length > 0) {
//       await databases.deleteDocument(
//         db,
//         voteCollection,
//         response.documents[0].$id
//       );

//       // Decrease the reputation of the question/answer author
//       const questionOrAnswer = await databases.getDocument(
//         db,
//         type === "question" ? questionCollection : answerCollection,
//         typeId
//       );

//       const authorPrefs = await users.getPrefs<UserPrefs>(
//         questionOrAnswer.authorId
//       );

//       await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
//         reputation:
//           response.documents[0].voteStatus === "upvoted"
//             ? Number(authorPrefs.reputation) - 1
//             : Number(authorPrefs.reputation) + 1,
//       });
//     }

//     // that means prev vote does not exists or voteStatus changed
//     if (response.documents[0]?.voteStatus !== voteStatus) {
//       const doc = await databases.createDocument(
//         db,
//         voteCollection,
//         ID.unique(),
//         {
//           type,
//           typeId,
//           voteStatus,
//           votedById,
//         }
//       );

//       // Increate/Decrease the reputation of the question/answer author accordingly
//       const questionOrAnswer = await databases.getDocument(
//         db,
//         type === "question" ? questionCollection : answerCollection,
//         typeId
//       );

//       const authorPrefs = await users.getPrefs<UserPrefs>(
//         questionOrAnswer.authorId
//       );

//       // if vote was present
//       if (response.documents[0]) {
//         await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
//           reputation:
//             // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
//             response.documents[0].voteStatus === "upvoted"
//               ? Number(authorPrefs.reputation) - 1
//               : Number(authorPrefs.reputation) + 1,
//         });
//       } else {
//         await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
//           reputation:
//             // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
//             voteStatus === "upvoted"
//               ? Number(authorPrefs.reputation) + 1
//               : Number(authorPrefs.reputation) - 1,
//         });
//       }

//       const [upvotes, downvotes] = await Promise.all([
//         databases.listDocuments(db, voteCollection, [
//           Query.equal("type", type),
//           Query.equal("typeId", typeId),
//           Query.equal("voteStatus", "upvoted"),
//           Query.equal("votedById", votedById),
//           Query.limit(1), // for optimization as we only need total
//         ]),
//         databases.listDocuments(db, voteCollection, [
//           Query.equal("type", type),
//           Query.equal("typeId", typeId),
//           Query.equal("voteStatus", "downvoted"),
//           Query.equal("votedById", votedById),
//           Query.limit(1), // for optimization as we only need total
//         ]),
//       ]);

//       return NextResponse.json(
//         {
//           data: { document: doc, voteResult: upvotes.total - downvotes.total },
//           message: response.documents[0] ? "Vote Status Updated" : "Voted",
//         },
//         {
//           status: 201,
//         }
//       );
//     }

//     const [upvotes, downvotes] = await Promise.all([
//       databases.listDocuments(db, voteCollection, [
//         Query.equal("type", type),
//         Query.equal("typeId", typeId),
//         Query.equal("voteStatus", "upvoted"),
//         Query.equal("votedById", votedById),
//         Query.limit(1), // for optimization as we only need total
//       ]),
//       databases.listDocuments(db, voteCollection, [
//         Query.equal("type", type),
//         Query.equal("typeId", typeId),
//         Query.equal("voteStatus", "downvoted"),
//         Query.equal("votedById", votedById),
//         Query.limit(1), // for optimization as we only need total
//       ]),
//     ]);

//     return NextResponse.json(
//       {
//         data: {
//           document: null,
//           voteResult: upvotes.total - downvotes.total,
//         },
//         message: "Vote Withdrawn",
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error?.message || "Error deleting answer" },
//       { status: error?.status || error?.code || 500 }
//     );
//   }
// }

import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

type VoteStatus = "upvoted" | "downvoted";
type VoteType = "question" | "answer";

const repDelta = (status: VoteStatus) => (status === "upvoted" ? 1 : -1);

export async function POST(request: NextRequest) {
  try {
    const { votedById, voteStatus, type, typeId } = (await request.json()) as {
      votedById: string;
      voteStatus: VoteStatus;
      type: VoteType;
      typeId: string;
    };

    // Find existing vote by this user on this item
    const existing = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
      Query.limit(1),
    ]);

    const prevVote = existing.documents[0] as any | undefined;

    // Get author of question/answer (to update reputation)
    const targetDoc = await databases.getDocument(
      db,
      type === "question" ? questionCollection : answerCollection,
      typeId
    );
    const authorId = (targetDoc as any).authorId as string;

    // If there was a previous vote, remove it first (withdraw effect + delete vote doc)
    if (prevVote) {
      await databases.deleteDocument(db, voteCollection, prevVote.$id);

      const prefs = await users.getPrefs<UserPrefs>(authorId);
      await users.updatePrefs<UserPrefs>(authorId, {
        reputation: Number(prefs.reputation) - repDelta(prevVote.voteStatus),
      });
    }

    // If user clicked the same vote again => this is a withdrawal (no new vote created)
    if (prevVote && prevVote.voteStatus === voteStatus) {
      // compute totals (IMPORTANT: do NOT filter by votedById)
      const [upvotes, downvotes] = await Promise.all([
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "upvoted"),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "downvoted"),
          Query.limit(1),
        ]),
      ]);

      return NextResponse.json(
        {
          data: {
            document: null,
            voteResult: upvotes.total - downvotes.total,
          },
          message: "Vote Withdrawn",
        },
        { status: 200 }
      );
    }

    // Otherwise create a new vote doc
    const created = await databases.createDocument(
      db,
      voteCollection,
      ID.unique(),
      {
        type,
        typeId,
        voteStatus,
        votedById,
      }
    );

    // Apply reputation effect of new vote
    const prefs = await users.getPrefs<UserPrefs>(authorId);
    await users.updatePrefs<UserPrefs>(authorId, {
      reputation: Number(prefs.reputation) + repDelta(voteStatus),
    });

    // compute totals (IMPORTANT: do NOT filter by votedById)
    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.limit(1),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: created,
          voteResult: upvotes.total - downvotes.total,
        },
        message: prevVote ? "Vote Status Updated" : "Voted",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Error voting" },
      { status: error?.status || error?.code || 500 }
    );
  }
}
