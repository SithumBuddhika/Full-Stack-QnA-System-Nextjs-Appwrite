// import Answers from "@/components/Answers";
// import Comments from "@/components/Comments";
// import { MarkdownPreview } from "@/components/RTE";
// import VoteButtons from "@/components/VoteButtons";
// import Particles from "@/components/magicui/particles";
// import ShimmerButton from "@/components/magicui/shimmer-button";
// import { TracingBeam } from "@/components/ui/tracing-beam";

// import { avatars, storage } from "@/models/client/config";
// import {
//   answerCollection,
//   commentCollection,
//   db,
//   questionAttachmentBucket,
//   questionCollection,
//   voteCollection,
// } from "@/models/name";
// import { databases, users } from "@/models/server/config";

// import { UserPrefs } from "@/store/Auth";
// import convertDateToRelativeTime from "@/utils/relativeTime";
// import slugify from "@/utils/slugify";
// import Link from "next/link";
// import { Query, Models } from "node-appwrite";

// import DeleteQuestion from "./DeleteQuestion";
// import EditQuestion from "./EditQuestion";

// /** Minimal author shape you attach into documents */
// type AuthorShape = {
//   $id: string;
//   name: string;
//   reputation: number;
// };

// /** Document types we actually use on the page */
// type QuestionDoc = Models.Document & {
//   title: string;
//   content: string;
//   tags: string[];
//   authorId: string;
//   attachmentId: string;
// };

// type CommentDoc = Models.Document & {
//   content: string;
//   authorId: string;
//   type: "question" | "answer";
//   typeId: string;
//   author: AuthorShape;
// };

// type AnswerDoc = Models.Document & {
//   content: string;
//   authorId: string;
//   questionId: string;
//   comments: Models.DocumentList<CommentDoc>;
//   upvotesDocuments: Models.DocumentList<Models.Document>;
//   downvotesDocuments: Models.DocumentList<Models.Document>;
//   author: AuthorShape;
// };

// const Page = async ({
//   params,
// }: {
//   params: { quesId: string; quesName: string };
// }) => {
//   const [question, answers, upvotes, downvotes, comments] = await Promise.all([
//     databases.getDocument<QuestionDoc>(db, questionCollection, params.quesId),

//     databases.listDocuments<Models.Document>(db, answerCollection, [
//       Query.orderDesc("$createdAt"),
//       Query.equal("questionId", params.quesId),
//     ]),

//     databases.listDocuments(db, voteCollection, [
//       Query.equal("typeId", params.quesId),
//       Query.equal("type", "question"),
//       Query.equal("voteStatus", "upvoted"),
//       Query.limit(1),
//     ]),

//     databases.listDocuments(db, voteCollection, [
//       Query.equal("typeId", params.quesId),
//       Query.equal("type", "question"),
//       Query.equal("voteStatus", "downvoted"),
//       Query.limit(1),
//     ]),

//     databases.listDocuments<Models.Document>(db, commentCollection, [
//       Query.equal("type", "question"),
//       Query.equal("typeId", params.quesId),
//       Query.orderDesc("$createdAt"),
//     ]),
//   ]);

//   // Fetch question author
//   const questionAuthor = await users.get<UserPrefs>(question.authorId);

//   // Hydrate question comments with author object
//   const hydratedQuestionComments: CommentDoc[] = await Promise.all(
//     comments.documents.map(async (c) => {
//       const a = await users.get<UserPrefs>((c as any).authorId);
//       return {
//         ...(c as any),
//         author: {
//           $id: a.$id,
//           name: a.name,
//           reputation: Number(a.prefs?.reputation ?? 0),
//         },
//       } as CommentDoc;
//     })
//   );

//   const typedComments: Models.DocumentList<CommentDoc> = {
//     ...comments,
//     documents: hydratedQuestionComments,
//   };

//   // Hydrate answers: author + comments(with author) + upvote/downvote lists
//   const hydratedAnswers: AnswerDoc[] = await Promise.all(
//     answers.documents.map(async (aDoc) => {
//       const answer = aDoc as any;

//       const [aAuthor, aComments, aUpvotes, aDownvotes] = await Promise.all([
//         users.get<UserPrefs>(answer.authorId),

//         databases.listDocuments<Models.Document>(db, commentCollection, [
//           Query.equal("typeId", answer.$id),
//           Query.equal("type", "answer"),
//           Query.orderDesc("$createdAt"),
//         ]),

//         databases.listDocuments(db, voteCollection, [
//           Query.equal("typeId", answer.$id),
//           Query.equal("type", "answer"),
//           Query.equal("voteStatus", "upvoted"),
//           Query.limit(1),
//         ]),

//         databases.listDocuments(db, voteCollection, [
//           Query.equal("typeId", answer.$id),
//           Query.equal("type", "answer"),
//           Query.equal("voteStatus", "downvoted"),
//           Query.limit(1),
//         ]),
//       ]);

//       const hydratedAnswerComments: CommentDoc[] = await Promise.all(
//         aComments.documents.map(async (c) => {
//           const ca = await users.get<UserPrefs>((c as any).authorId);
//           return {
//             ...(c as any),
//             author: {
//               $id: ca.$id,
//               name: ca.name,
//               reputation: Number(ca.prefs?.reputation ?? 0),
//             },
//           } as CommentDoc;
//         })
//       );

//       const typedAnswerComments: Models.DocumentList<CommentDoc> = {
//         ...aComments,
//         documents: hydratedAnswerComments,
//       };

//       const out: AnswerDoc = {
//         ...(answer as Models.Document),
//         comments: typedAnswerComments,
//         upvotesDocuments: aUpvotes,
//         downvotesDocuments: aDownvotes,
//         author: {
//           $id: aAuthor.$id,
//           name: aAuthor.name,
//           reputation: Number(aAuthor.prefs?.reputation ?? 0),
//         },
//         content: String(answer.content ?? ""),
//         authorId: String(answer.authorId ?? ""),
//         questionId: String(answer.questionId ?? ""),
//       };

//       return out;
//     })
//   );

//   const typedAnswers: Models.DocumentList<AnswerDoc> = {
//     ...answers,
//     documents: hydratedAnswers,
//   };

//   // IMPORTANT: do NOT use .href (Appwrite returns string / URL depending on SDK typing)
//   const questionImageSrc = storage.getFilePreview(
//     questionAttachmentBucket,
//     question.attachmentId
//   ) as unknown as string;

//   const authorAvatarSrc = avatars.getInitials(
//     questionAuthor.name,
//     36,
//     36
//   ) as unknown as string;

//   return (
//     <TracingBeam className="container pl-6">
//       <Particles
//         className="fixed inset-0 h-full w-full"
//         quantity={500}
//         ease={100}
//         color="#ffffff"
//         refresh
//       />

//       <div className="relative mx-auto px-4 pb-20 pt-36">
//         <div className="flex">
//           <div className="w-full">
//             <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
//             <div className="flex gap-4 text-sm">
//               <span>
//                 Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
//               </span>
//               <span>Answer {typedAnswers.total}</span>
//               <span>Votes {upvotes.total + downvotes.total}</span>
//             </div>
//           </div>

//           <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
//             <ShimmerButton className="shadow-2xl">
//               <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
//                 Ask a question
//               </span>
//             </ShimmerButton>
//           </Link>
//         </div>

//         <hr className="my-4 border-white/40" />

//         <div className="flex gap-4">
//           <div className="flex shrink-0 flex-col items-center gap-4">
//             <VoteButtons
//               type="question"
//               id={question.$id}
//               className="w-full"
//               upvotes={upvotes}
//               downvotes={downvotes}
//             />

//             <EditQuestion
//               questionId={question.$id}
//               questionTitle={question.title}
//               authorId={question.authorId}
//             />

//             <DeleteQuestion
//               questionId={question.$id}
//               authorId={question.authorId}
//             />
//           </div>

//           <div className="w-full overflow-auto">
//             <MarkdownPreview
//               className="rounded-xl p-4"
//               source={question.content}
//             />

//             <picture>
//               <img
//                 src={questionImageSrc}
//                 alt={question.title}
//                 className="mt-3 rounded-lg"
//               />
//             </picture>

//             <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
//               {question.tags.map((tag) => (
//                 <Link
//                   key={tag}
//                   href={`/questions?tag=${tag}`}
//                   className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
//                 >
//                   #{tag}
//                 </Link>
//               ))}
//             </div>

//             <div className="mt-4 flex items-center justify-end gap-1">
//               <picture>
//                 <img
//                   src={authorAvatarSrc}
//                   alt={questionAuthor.name}
//                   className="rounded-lg"
//                 />
//               </picture>

//               <div className="block leading-tight">
//                 <Link
//                   href={`/users/${questionAuthor.$id}/${slugify(
//                     questionAuthor.name
//                   )}`}
//                   className="text-orange-500 hover:text-orange-600"
//                 >
//                   {questionAuthor.name}
//                 </Link>
//                 <p>
//                   <strong>{questionAuthor.prefs.reputation}</strong>
//                 </p>
//               </div>
//             </div>

//             <Comments
//               comments={typedComments}
//               className="mt-4"
//               type="question"
//               typeId={question.$id}
//             />

//             <hr className="my-4 border-white/40" />
//           </div>
//         </div>

//         <Answers answers={typedAnswers as any} questionId={question.$id} />
//       </div>
//     </TracingBeam>
//   );
// };

// export default Page;

// import Answers from "@/components/Answers";
// import Comments from "@/components/Comments";
// import { MarkdownPreview } from "@/components/RTE";
// import VoteButtons from "@/components/VoteButtons";
// import Particles from "@/components/ui/particles";
// import { TracingBeam } from "@/components/ui/tracing-beam";
// import ShimmerButton from "@/components/ui/shimmer-button";

// import { avatars, storage } from "@/models/client/config";
// import {
//   answerCollection,
//   commentCollection,
//   db,
//   questionAttachmentBucket,
//   questionCollection,
//   voteCollection,
// } from "@/models/name";
// import { databases, users } from "@/models/server/config";

// import { UserPrefs } from "@/store/Auth";
// import convertDateToRelativeTime from "@/utils/relativeTime";
// import slugify from "@/utils/slugify";
// import Link from "next/link";
// import { Query } from "node-appwrite";

// import DeleteQuestion from "./DeleteQuestion";
// import EditQuestion from "./EditQuestion";

// import type {
//   AnswerDoc,
//   AnswerList,
//   CommentDoc,
//   CommentList,
//   VoteList,
// } from "@/types/qna";

// type QuestionDoc = {
//   $id: string;
//   $createdAt: string;
//   $updatedAt: string;
//   title: string;
//   content: string;
//   tags: string[];
//   authorId: string;
//   attachmentId: string;
// };

// const Page = async ({
//   params,
// }: {
//   params: { quesId: string; quesName: string };
// }) => {
//   const [questionRaw, answersRaw, upvotesRaw, downvotesRaw, commentsRaw] =
//     await Promise.all([
//       databases.getDocument(db, questionCollection, params.quesId),
//       databases.listDocuments(db, answerCollection, [
//         Query.orderDesc("$createdAt"),
//         Query.equal("questionId", params.quesId),
//       ]),
//       databases.listDocuments(db, voteCollection, [
//         Query.equal("typeId", params.quesId),
//         Query.equal("type", "question"),
//         Query.equal("voteStatus", "upvoted"),
//         Query.limit(1),
//       ]),
//       databases.listDocuments(db, voteCollection, [
//         Query.equal("typeId", params.quesId),
//         Query.equal("type", "question"),
//         Query.equal("voteStatus", "downvoted"),
//         Query.limit(1),
//       ]),
//       databases.listDocuments(db, commentCollection, [
//         Query.equal("type", "question"),
//         Query.equal("typeId", params.quesId),
//         Query.orderDesc("$createdAt"),
//       ]),
//     ]);

//   const question: QuestionDoc = {
//     $id: String((questionRaw as any).$id),
//     $createdAt: String((questionRaw as any).$createdAt),
//     $updatedAt: String((questionRaw as any).$updatedAt),
//     title: String((questionRaw as any).title ?? ""),
//     content: String((questionRaw as any).content ?? ""),
//     tags: ((questionRaw as any).tags ?? []) as string[],
//     authorId: String((questionRaw as any).authorId ?? ""),
//     attachmentId: String((questionRaw as any).attachmentId ?? ""),
//   };

//   const questionAuthor = await users.get<UserPrefs>(question.authorId);

//   const typedQuestionCommentsDocs: CommentDoc[] = await Promise.all(
//     (commentsRaw as any).documents.map(async (c: any) => {
//       const a = await users.get<UserPrefs>(c.authorId);
//       return {
//         $id: String(c.$id),
//         $createdAt: String(c.$createdAt),
//         $updatedAt: String(c.$updatedAt),
//         content: String(c.content ?? ""),
//         authorId: String(c.authorId),
//         type: c.type,
//         typeId: String(c.typeId),
//         author: {
//           $id: a.$id,
//           name: a.name,
//           reputation: Number(a.prefs?.reputation ?? 0),
//         },
//       };
//     })
//   );

//   const typedComments: CommentList = {
//     total: Number((commentsRaw as any).total ?? 0),
//     documents: typedQuestionCommentsDocs,
//   };

//   const typedAnswersDocs: AnswerDoc[] = await Promise.all(
//     (answersRaw as any).documents.map(async (a: any) => {
//       const [aAuthor, aComments, aUpvotes, aDownvotes] = await Promise.all([
//         users.get<UserPrefs>(a.authorId),
//         databases.listDocuments(db, commentCollection, [
//           Query.equal("typeId", a.$id),
//           Query.equal("type", "answer"),
//           Query.orderDesc("$createdAt"),
//         ]),
//         databases.listDocuments(db, voteCollection, [
//           Query.equal("typeId", a.$id),
//           Query.equal("type", "answer"),
//           Query.equal("voteStatus", "upvoted"),
//           Query.limit(1),
//         ]),
//         databases.listDocuments(db, voteCollection, [
//           Query.equal("typeId", a.$id),
//           Query.equal("type", "answer"),
//           Query.equal("voteStatus", "downvoted"),
//           Query.limit(1),
//         ]),
//       ]);

//       const typedAnswerCommentsDocs: CommentDoc[] = await Promise.all(
//         (aComments as any).documents.map(async (c: any) => {
//           const ca = await users.get<UserPrefs>(c.authorId);
//           return {
//             $id: String(c.$id),
//             $createdAt: String(c.$createdAt),
//             $updatedAt: String(c.$updatedAt),
//             content: String(c.content ?? ""),
//             authorId: String(c.authorId),
//             type: c.type,
//             typeId: String(c.typeId),
//             author: {
//               $id: ca.$id,
//               name: ca.name,
//               reputation: Number(ca.prefs?.reputation ?? 0),
//             },
//           };
//         })
//       );

//       const toVoteList = (raw: any): VoteList => ({
//         total: Number(raw?.total ?? 0),
//         documents: (raw?.documents ?? []).map((v: any) => ({
//           $id: String(v.$id),
//           $createdAt: String(v.$createdAt),
//           $updatedAt: String(v.$updatedAt),
//           voteStatus: v.voteStatus,
//           votedById: v.votedById,
//           type: v.type,
//           typeId: v.typeId,
//         })),
//       });

//       return {
//         $id: String(a.$id),
//         $createdAt: String(a.$createdAt),
//         $updatedAt: String(a.$updatedAt),

//         content: String(a.content ?? ""),
//         authorId: String(a.authorId ?? ""),
//         questionId: String(a.questionId ?? ""),

//         author: {
//           $id: aAuthor.$id,
//           name: aAuthor.name,
//           reputation: Number(aAuthor.prefs?.reputation ?? 0),
//         },

//         comments: {
//           total: Number((aComments as any).total ?? 0),
//           documents: typedAnswerCommentsDocs,
//         },

//         upvotesDocuments: toVoteList(aUpvotes),
//         downvotesDocuments: toVoteList(aDownvotes),
//       };
//     })
//   );

//   const typedAnswers: AnswerList = {
//     total: Number((answersRaw as any).total ?? 0),
//     documents: typedAnswersDocs,
//   };

//   const questionImageSrc = String(
//     storage.getFilePreview(questionAttachmentBucket, question.attachmentId)
//   );

//   const authorAvatarSrc = String(
//     avatars.getInitials(questionAuthor.name, 36, 36)
//   );

//   // For question votes we only display counts, VoteButtons expects VoteList
//   const toVoteList = (raw: any): VoteList => ({
//     total: Number(raw?.total ?? 0),
//     documents: (raw?.documents ?? []).map((v: any) => ({
//       $id: String(v.$id),
//       $createdAt: String(v.$createdAt),
//       $updatedAt: String(v.$updatedAt),
//       voteStatus: v.voteStatus,
//       votedById: v.votedById,
//       type: v.type,
//       typeId: v.typeId,
//     })),
//   });

//   const upvotes = toVoteList(upvotesRaw);
//   const downvotes = toVoteList(downvotesRaw);

//   return (
//     <TracingBeam className="container pl-6">
//       <Particles
//         className="fixed inset-0 h-full w-full"
//         quantity={500}
//         ease={100}
//         color="#ffffff"
//         refresh
//       />

//       <div className="relative mx-auto px-4 pb-20 pt-36">
//         <div className="flex">
//           <div className="w-full">
//             <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
//             <div className="flex gap-4 text-sm">
//               <span>
//                 Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
//               </span>
//               <span>Answer {typedAnswers.total}</span>
//               <span>Votes {upvotes.total + downvotes.total}</span>
//             </div>
//           </div>

//           <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
//             <ShimmerButton className="shadow-2xl">
//               <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
//                 Ask a question
//               </span>
//             </ShimmerButton>
//           </Link>
//         </div>

//         <hr className="my-4 border-white/40" />

//         <div className="flex gap-4">
//           <div className="flex shrink-0 flex-col items-center gap-4">
//             <VoteButtons
//               type="question"
//               id={question.$id}
//               className="w-full"
//               upvotes={upvotes}
//               downvotes={downvotes}
//             />

//             <EditQuestion
//               questionId={question.$id}
//               questionTitle={question.title}
//               authorId={question.authorId}
//             />
//             <DeleteQuestion
//               questionId={question.$id}
//               authorId={question.authorId}
//             />
//           </div>

//           <div className="w-full overflow-auto">
//             <MarkdownPreview
//               className="rounded-xl p-4"
//               source={question.content}
//             />

//             <picture>
//               <img
//                 src={questionImageSrc}
//                 alt={question.title}
//                 className="mt-3 rounded-lg"
//               />
//             </picture>

//             <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
//               {question.tags.map((tag) => (
//                 <Link
//                   key={tag}
//                   href={`/questions?tag=${tag}`}
//                   className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
//                 >
//                   #{tag}
//                 </Link>
//               ))}
//             </div>

//             <div className="mt-4 flex items-center justify-end gap-1">
//               <picture>
//                 <img
//                   src={authorAvatarSrc}
//                   alt={questionAuthor.name}
//                   className="rounded-lg"
//                 />
//               </picture>

//               <div className="block leading-tight">
//                 <Link
//                   href={`/users/${questionAuthor.$id}/${slugify(
//                     questionAuthor.name
//                   )}`}
//                   className="text-orange-500 hover:text-orange-600"
//                 >
//                   {questionAuthor.name}
//                 </Link>
//                 <p>
//                   <strong>{questionAuthor.prefs.reputation}</strong>
//                 </p>
//               </div>
//             </div>

//             <Comments
//               comments={typedComments}
//               className="mt-4"
//               type="question"
//               typeId={question.$id}
//             />

//             <hr className="my-4 border-white/40" />
//           </div>
//         </div>

//         <Answers answers={typedAnswers} questionId={question.$id} />
//       </div>
//     </TracingBeam>
//   );
// };

// export default Page;

import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";

import Particles from "@/components/ui/particles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import ShimmerButton from "@/components/ui/shimmer-button";

import { avatars } from "@/models/client/config";
import {
  answerCollection,
  commentCollection,
  db,
  questionAttachmentBucket,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users, storage } from "@/models/server/config"; // ✅ server storage
import { UserPrefs } from "@/store/Auth";

import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";

import Link from "next/link";
import { Query } from "node-appwrite";

import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";

import type {
  AnswerDoc,
  AnswerList,
  CommentDoc,
  CommentList,
  VoteList,
} from "@/types/qna";

type QuestionDoc = {
  $id: string;
  $createdAt: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId?: string;
};

function safeSrc(src: unknown) {
  const s = String(src || "");
  if (!s) return "/placeholder.png";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))
    return s;
  return "/placeholder.png";
}

const toVoteList = (raw: any): VoteList => ({
  total: Number(raw?.total ?? 0),
  documents: (raw?.documents ?? []).map((v: any) => ({
    $id: String(v.$id),
    $createdAt: String(v.$createdAt),
    voteStatus: v.voteStatus,
    votedById: v.votedById,
    type: v.type,
    typeId: v.typeId,
  })),
});

export default async function Page({
  params,
}: {
  // ✅ Next 16 can pass params as a Promise-like
  params:
    | Promise<{ quesId: string; quesName: string }>
    | { quesId: string; quesName: string };
}) {
  const p = await Promise.resolve(params); // ✅ fixes "params is a Promise"
  const quesId = p.quesId;

  const [questionRaw, answersRaw, upvotesRaw, downvotesRaw, commentsRaw] =
    await Promise.all([
      databases.getDocument(db, questionCollection, quesId),

      databases.listDocuments(db, answerCollection, [
        Query.orderDesc("$createdAt"),
        Query.equal("questionId", quesId),
      ]),

      databases.listDocuments(db, voteCollection, [
        Query.equal("typeId", quesId),
        Query.equal("type", "question"),
        Query.equal("voteStatus", "upvoted"),
        Query.limit(1),
      ]),

      databases.listDocuments(db, voteCollection, [
        Query.equal("typeId", quesId),
        Query.equal("type", "question"),
        Query.equal("voteStatus", "downvoted"),
        Query.limit(1),
      ]),

      databases.listDocuments(db, commentCollection, [
        Query.equal("type", "question"),
        Query.equal("typeId", quesId),
        Query.orderDesc("$createdAt"),
      ]),
    ]);

  const question: QuestionDoc = {
    $id: String((questionRaw as any).$id),
    $createdAt: String((questionRaw as any).$createdAt),
    title: String((questionRaw as any).title ?? ""),
    content: String((questionRaw as any).content ?? ""),
    tags: ((questionRaw as any).tags ?? []) as string[],
    authorId: String((questionRaw as any).authorId ?? ""),
    attachmentId: (questionRaw as any).attachmentId
      ? String((questionRaw as any).attachmentId)
      : undefined,
  };

  const questionAuthor = await users.get<UserPrefs>(question.authorId);

  const typedQuestionCommentsDocs: CommentDoc[] = await Promise.all(
    (commentsRaw as any).documents.map(async (c: any) => {
      const a = await users.get<UserPrefs>(c.authorId);
      return {
        $id: String(c.$id),
        $createdAt: String(c.$createdAt),
        content: String(c.content ?? ""),
        authorId: String(c.authorId),
        type: c.type,
        typeId: String(c.typeId),
        author: {
          $id: a.$id,
          name: a.name,
          reputation: Number(a.prefs?.reputation ?? 0),
        },
      };
    })
  );

  const typedComments: CommentList = {
    total: Number((commentsRaw as any).total ?? 0),
    documents: typedQuestionCommentsDocs,
  };

  const typedAnswersDocs: AnswerDoc[] = await Promise.all(
    (answersRaw as any).documents.map(async (a: any) => {
      const [aAuthor, aComments, aUpvotes, aDownvotes] = await Promise.all([
        users.get<UserPrefs>(a.authorId),
        databases.listDocuments(db, commentCollection, [
          Query.equal("typeId", a.$id),
          Query.equal("type", "answer"),
          Query.orderDesc("$createdAt"),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("typeId", a.$id),
          Query.equal("type", "answer"),
          Query.equal("voteStatus", "upvoted"),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("typeId", a.$id),
          Query.equal("type", "answer"),
          Query.equal("voteStatus", "downvoted"),
          Query.limit(1),
        ]),
      ]);

      const typedAnswerCommentsDocs: CommentDoc[] = await Promise.all(
        (aComments as any).documents.map(async (c: any) => {
          const ca = await users.get<UserPrefs>(c.authorId);
          return {
            $id: String(c.$id),
            $createdAt: String(c.$createdAt),
            content: String(c.content ?? ""),
            authorId: String(c.authorId),
            type: c.type,
            typeId: String(c.typeId),
            author: {
              $id: ca.$id,
              name: ca.name,
              reputation: Number(ca.prefs?.reputation ?? 0),
            },
          };
        })
      );

      return {
        $id: String(a.$id),
        $createdAt: String(a.$createdAt),
        content: String(a.content ?? ""),
        authorId: String(a.authorId ?? ""),
        questionId: String(a.questionId ?? ""),
        author: {
          $id: aAuthor.$id,
          name: aAuthor.name,
          reputation: Number(aAuthor.prefs?.reputation ?? 0),
        },
        comments: {
          total: Number((aComments as any).total ?? 0),
          documents: typedAnswerCommentsDocs,
        },
        upvotesDocuments: toVoteList(aUpvotes),
        downvotesDocuments: toVoteList(aDownvotes),
      };
    })
  );

  const typedAnswers: AnswerList = {
    total: Number((answersRaw as any).total ?? 0),
    documents: typedAnswersDocs,
  };

  const upvotes = toVoteList(upvotesRaw);
  const downvotes = toVoteList(downvotesRaw);

  // ✅ IMPORTANT: view (no transformations / no plan block)
  const questionImageSrc = question.attachmentId
    ? safeSrc(
        storage.getFileView(questionAttachmentBucket, question.attachmentId)
      )
    : "/placeholder.png";

  const authorAvatarSrc = safeSrc(
    avatars.getInitials(questionAuthor.name, 36, 36)
  );

  return (
    <TracingBeam className="container pl-6">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={100}
        refresh
      />

      <div className="relative mx-auto px-4 pb-20 pt-36">
        <div className="flex">
          <div className="w-full">
            <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
            <div className="flex gap-4 text-sm">
              <span>
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </span>
              <span>Answer {typedAnswers.total}</span>
              <span>Votes {upvotes.total + downvotes.total}</span>
            </div>
          </div>

          <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                Ask a question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        <hr className="my-4 border-white/40" />

        <div className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center gap-4">
            <VoteButtons
              type="question"
              id={question.$id}
              className="w-full"
              upvotes={upvotes}
              downvotes={downvotes}
            />

            <EditQuestion
              questionId={question.$id}
              questionTitle={question.title}
              authorId={question.authorId}
            />

            <DeleteQuestion
              questionId={question.$id}
              authorId={question.authorId}
            />
          </div>

          <div className="w-full overflow-auto">
            <MarkdownPreview
              className="rounded-xl p-4"
              source={question.content}
            />

            <picture>
              <img
                src={questionImageSrc}
                alt={question.title}
                className="mt-3 rounded-lg"
              />
            </picture>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {question.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/questions?tag=${tag}`}
                  className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-1">
              <picture>
                <img
                  src={authorAvatarSrc}
                  alt={questionAuthor.name}
                  className="rounded-lg"
                />
              </picture>

              <div className="block leading-tight">
                <Link
                  href={`/users/${questionAuthor.$id}/${slugify(
                    questionAuthor.name
                  )}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {questionAuthor.name}
                </Link>
                <p>
                  <strong>{questionAuthor.prefs.reputation}</strong>
                </p>
              </div>
            </div>

            <Comments
              comments={typedComments}
              className="mt-4"
              type="question"
              typeId={question.$id}
            />

            <hr className="my-4 border-white/40" />
          </div>
        </div>

        <Answers answers={typedAnswers} questionId={question.$id} />
      </div>
    </TracingBeam>
  );
}
