// "use client";

// import { databases } from "@/models/client/config";
// import { db, voteCollection } from "@/models/name";
// import { useAuthStore } from "@/store/Auth";
// import { cn } from "@/lib/utils";
// import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
// import { ID, Models, Query } from "appwrite";
// import { useRouter } from "next/navigation";
// import React from "react";

// const VoteButtons = ({
//   type,
//   id,
//   upvotes,
//   downvotes,
//   className,
// }: {
//   type: "question" | "answer";
//   id: string;
//   upvotes: Models.DocumentList<Models.Document>;
//   downvotes: Models.DocumentList<Models.Document>;
//   className?: string;
// }) => {
//   const [votedDocument, setVotedDocument] =
//     React.useState<Models.Document | null>(); // undefined means not fetched yet
//   const [voteResult, setVoteResult] = React.useState<number>(
//     upvotes.total - downvotes.total
//   );

//   const { user } = useAuthStore();
//   const router = useRouter();

//   React.useEffect(() => {
//     (async () => {
//       if (user) {s
//         const response = await databases.listDocuments(db, voteCollection, [
//           Query.equal("type", type),
//           Query.equal("typeId", id),
//           Query.equal("votedById", user.$id),
//         ]);
//         setVotedDocument(() => response.documents[0] || null);
//       }
//     })();
//   }, [user, id, type]);

//   const toggleUpvote = async () => {
//     if (!user) return router.push("/login");

//     if (votedDocument === undefined) return;

//     try {
//       const response = await fetch(`/api/vote`, {
//         method: "POST",
//         body: JSON.stringify({
//           votedById: user.$id,
//           voteStatus: "upvoted",
//           type,
//           typeId: id,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw data;

//       setVoteResult(() => data.data.voteResult);
//       setVotedDocument(() => data.data.document);
//     } catch (error: any) {
//       window.alert(error?.message || "Something went wrong");
//     }
//   };

//   const toggleDownvote = async () => {
//     if (!user) return router.push("/login");

//     if (votedDocument === undefined) return;

//     try {
//       const response = await fetch(`/api/vote`, {
//         method: "POST",
//         body: JSON.stringify({
//           votedById: user.$id,
//           voteStatus: "downvoted",
//           type,
//           typeId: id,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw data;

//       setVoteResult(() => data.data.voteResult);
//       setVotedDocument(() => data.data.document);
//     } catch (error: any) {
//       window.alert(error?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div
//       className={cn(
//         "flex shrink-0 flex-col items-center justify-start gap-y-4",
//         className
//       )}
//     >
//       <button
//         className={cn(
//           "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
//           votedDocument && votedDocument.voteStatus === "upvoted"
//             ? "border-orange-500 text-orange-500"
//             : "border-white/30"
//         )}
//         onClick={toggleUpvote}
//       >
//         <IconCaretUpFilled />
//       </button>
//       <span>{voteResult}</span>
//       <button
//         className={cn(
//           "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
//           votedDocument && votedDocument.voteStatus === "downvoted"
//             ? "border-orange-500 text-orange-500"
//             : "border-white/30"
//         )}
//         onClick={toggleDownvote}
//       >
//         <IconCaretDownFilled />
//       </button>
//     </div>
//   );
// };

// export default VoteButtons;

"use client";

import React from "react";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import type { VoteDoc, VoteList } from "@/types/qna";

const VoteButtons = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: VoteList;
  downvotes: VoteList;
  className?: string;
}) => {
  const [votedDocument, setVotedDocument] = React.useState<
    VoteDoc | null | undefined
  >(undefined); // undefined = loading, null = none
  const [voteResult, setVoteResult] = React.useState<number>(
    (upvotes?.total ?? 0) - (downvotes?.total ?? 0)
  );

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (!user) {
        setVotedDocument(null);
        return;
      }

      try {
        const res = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
          Query.limit(1),
        ]);

        const doc = res.documents?.[0] as any;

        setVotedDocument(
          doc
            ? ({
                $id: String(doc.$id),
                $createdAt: String(doc.$createdAt),
                $updatedAt: String(doc.$updatedAt),
                voteStatus: doc.voteStatus,
                votedById: doc.votedById,
                type: doc.type,
                typeId: doc.typeId,
              } as VoteDoc)
            : null
        );
      } catch {
        setVotedDocument(null);
      }
    })();
  }, [user, id, type]);

  const postVote = async (voteStatus: "upvoted" | "downvoted") => {
    if (!user) return router.push("/login");
    if (votedDocument === undefined) return; // still loading

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus,
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(Number(data?.data?.voteResult ?? voteResult));

      const doc = data?.data?.document;
      setVotedDocument(
        doc
          ? ({
              $id: String(doc.$id),
              $createdAt: String(doc.$createdAt),
              $updatedAt: String(doc.$updatedAt),
              voteStatus: doc.voteStatus,
              votedById: doc.votedById,
              type: doc.type,
              typeId: doc.typeId,
            } as VoteDoc)
          : null
      );
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-start gap-y-4",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument && votedDocument.voteStatus === "upvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30"
        )}
        onClick={() => postVote("upvoted")}
      >
        <IconCaretUpFilled />
      </button>

      <span>{voteResult}</span>

      <button
        type="button"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument && votedDocument.voteStatus === "downvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30"
        )}
        onClick={() => postVote("downvoted")}
      >
        <IconCaretDownFilled />
      </button>
    </div>
  );
};

export default VoteButtons;
