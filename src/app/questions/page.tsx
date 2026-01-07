// import { databases, users } from "@/models/server/config";
// import {
//   answerCollection,
//   db,
//   voteCollection,
//   questionCollection,
// } from "@/models/name";
// import { Query } from "node-appwrite";
// import React from "react";
// import Link from "next/link";
// import ShimmerButton from "@/components/magicui/shimmer-button";
// import QuestionCard from "@/components/QuestionCard";
// import { UserPrefs } from "@/store/Auth";
// import Pagination from "@/components/Pagination";
// import Search from "./Search";

// const Page = async ({
//   searchParams,
// }: {
//   searchParams: { page?: string; tag?: string; search?: string };
// }) => {
//   searchParams.page ||= "1";

//   const queries = [
//     Query.orderDesc("$createdAt"),
//     Query.offset((+searchParams.page - 1) * 25),
//     Query.limit(25),
//   ];

//   if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
//   if (searchParams.search)
//     queries.push(
//       Query.or([
//         Query.search("title", searchParams.search),
//         Query.search("content", searchParams.search),
//       ])
//     );

//   const questions = await databases.listDocuments(
//     db,
//     questionCollection,
//     queries
//   );
//   console.log("Questions", questions);

//   questions.documents = await Promise.all(
//     questions.documents.map(async (ques) => {
//       const [author, answers, votes] = await Promise.all([
//         users.get<UserPrefs>(ques.authorId),
//         databases.listDocuments(db, answerCollection, [
//           Query.equal("questionId", ques.$id),
//           Query.limit(1), // for optimization
//         ]),
//         databases.listDocuments(db, voteCollection, [
//           Query.equal("type", "question"),
//           Query.equal("typeId", ques.$id),
//           Query.limit(1), // for optimization
//         ]),
//       ]);

//       return {
//         ...ques,
//         totalAnswers: answers.total,
//         totalVotes: votes.total,
//         author: {
//           $id: author.$id,
//           reputation: author.prefs.reputation,
//           name: author.name,
//         },
//       };
//     })
//   );

//   return (
//     <div className="container mx-auto px-4 pb-20 pt-36">
//       <div className="mb-10 flex items-center justify-between">
//         <h1 className="text-3xl font-bold">All Questions</h1>
//         <Link href="/questions/ask">
//           <ShimmerButton className="shadow-2xl">
//             <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
//               Ask a question
//             </span>
//           </ShimmerButton>
//         </Link>
//       </div>
//       <div className="mb-4">
//         <Search />
//       </div>
//       <div className="mb-4">
//         <p>{questions.total} questions</p>
//       </div>
//       <div className="mb-4 max-w-3xl space-y-6">
//         {questions.documents.map((ques) => (
//           <QuestionCard key={ques.$id} ques={ques} />
//         ))}
//       </div>
//       <Pagination total={questions.total} limit={25} />
//     </div>
//   );
// };

// export default Page;

// import { databases, users } from "@/models/server/config";
// import {
//   answerCollection,
//   db,
//   voteCollection,
//   questionCollection,
// } from "@/models/name";
// import { Query } from "node-appwrite";
// import Link from "next/link";
// import ShimmerButton from "@/components/magicui/shimmer-button";
// import QuestionCard from "@/components/QuestionCard";
// import { UserPrefs } from "@/store/Auth";
// import Pagination from "@/components/Pagination";
// import Search from "./Search";
// import type { QuestionCardDoc } from "@/types/qna";

// const Page = async ({
//   searchParams,
// }: {
//   searchParams: { page?: string; tag?: string; search?: string };
// }) => {
//   searchParams.page ||= "1";

//   const queries = [
//     Query.orderDesc("$createdAt"),
//     Query.offset((+searchParams.page - 1) * 25),
//     Query.limit(25),
//   ];

//   if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
//   if (searchParams.search) {
//     queries.push(
//       Query.or([
//         Query.search("title", searchParams.search),
//         Query.search("content", searchParams.search),
//       ])
//     );
//   }

//   const questions = await databases.listDocuments(
//     db,
//     questionCollection,
//     queries
//   );

//   const hydrated: QuestionCardDoc[] = await Promise.all(
//     questions.documents.map(async (ques: any) => {
//       const [author, answers, votes] = await Promise.all([
//         users.get<UserPrefs>(ques.authorId),
//         databases.listDocuments(db, answerCollection, [
//           Query.equal("questionId", ques.$id),
//           Query.limit(1),
//         ]),
//         databases.listDocuments(db, voteCollection, [
//           Query.equal("type", "question"),
//           Query.equal("typeId", ques.$id),
//           Query.limit(1),
//         ]),
//       ]);

//       return {
//         $id: String(ques.$id),
//         $createdAt: String(ques.$createdAt),
//         $updatedAt: String(ques.$updatedAt),

//         title: String(ques.title ?? ""),
//         tags: (ques.tags ?? []) as string[],
//         totalAnswers: Number(answers.total ?? 0),
//         totalVotes: Number(votes.total ?? 0),

//         author: {
//           $id: author.$id,
//           name: author.name,
//           reputation: Number(author.prefs?.reputation ?? 0),
//         },
//       };
//     })
//   );

//   return (
//     <div className="container mx-auto px-4 pb-20 pt-36">
//       <div className="mb-10 flex items-center justify-between">
//         <h1 className="text-3xl font-bold">All Questions</h1>
//         <Link href="/questions/ask">
//           <ShimmerButton className="shadow-2xl">
//             <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
//               Ask a question
//             </span>
//           </ShimmerButton>
//         </Link>
//       </div>

//       <div className="mb-4">
//         <Search />
//       </div>

//       <div className="mb-4">
//         <p>{questions.total} questions</p>
//       </div>

//       <div className="mb-4 max-w-3xl space-y-6">
//         {hydrated.map((ques) => (
//           <QuestionCard key={ques.$id} ques={ques} />
//         ))}
//       </div>

//       <Pagination total={questions.total} limit={25} />
//     </div>
//   );
// };

// export default Page;

import { databases, users } from "@/models/server/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";

type QuestionsSearchParams = {
  page?: string;
  tag?: string;
  search?: string;
};

export default async function Page({
  searchParams,
}: {
  // ✅ Next 16: searchParams might be a Promise
  searchParams: Promise<QuestionsSearchParams> | QuestionsSearchParams;
}) {
  const sp = await Promise.resolve(searchParams);

  const page = sp.page ? Number(sp.page) : 1;

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
    Query.limit(25),
  ];

  if (sp.tag) queries.push(Query.equal("tags", sp.tag));

  if (sp.search) {
    queries.push(
      Query.or([
        Query.search("title", sp.search),
        Query.search("content", sp.search),
      ])
    );
  }

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries
  );

  questions.documents = await Promise.all(
    questions.documents.map(async (ques: any) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: Number(author.prefs?.reputation ?? 0),
          name: author.name,
        },
      };
    })
  );

  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/questions/ask">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Ask a question
            </span>
          </ShimmerButton>
        </Link>
      </div>

      <div className="mb-4">
        <Search />
      </div>

      <div className="mb-4">
        <p>{questions.total} questions</p>
      </div>

      <div className="mb-4 max-w-3xl space-y-6">
        {questions.documents.map((ques: any) => (
          <QuestionCard key={ques.$id} ques={ques} />
        ))}
      </div>

      <Pagination total={questions.total} limit={25} />
    </div>
  );
}
