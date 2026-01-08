import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

type SP = { page?: string };

const Page = async ({
  params,
  searchParams,
}: {
  params:
    | { userId: string; userSlug: string }
    | Promise<{ userId: string; userSlug: string }>;
  searchParams: SP | Promise<SP>;
}) => {
  const p = await Promise.resolve(params);
  const sp = await Promise.resolve(searchParams);

  const page = sp.page ? Number(sp.page) : 1;

  const queries = [
    Query.equal("authorId", p.userId),
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
    Query.limit(25),
  ];

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
    <div className="px-4">
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
};

export default Page;
