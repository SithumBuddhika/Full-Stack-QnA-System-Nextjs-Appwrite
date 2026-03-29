import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { TracingBeam } from "@/components/ui/tracing-beam";
import ShimmerButton from "@/components/ui/shimmer-button";

import { avatars, storage } from "@/models/client/config";
import {
  answerCollection,
  commentCollection,
  db,
  questionAttachmentBucket,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";

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
  $updatedAt: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId?: string;
};

const toVoteList = (raw: any): VoteList => ({
  total: Number(raw?.total ?? 0),
  documents: (raw?.documents ?? []).map((v: any) => ({
    $id: String(v.$id),
    $createdAt: String(v.$createdAt),
    $updatedAt: String(v.$updatedAt),
    voteStatus: v.voteStatus,
    votedById: v.votedById,
    type: v.type,
    typeId: v.typeId,
  })),
});

export default async function Page({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>;
}) {
  const { quesId } = await params;

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
    $updatedAt: String((questionRaw as any).$updatedAt),
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
        $updatedAt: String(c.$updatedAt),
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
    }),
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
            $updatedAt: String(c.$updatedAt),
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
        }),
      );

      return {
        $id: String(a.$id),
        $createdAt: String(a.$createdAt),
        $updatedAt: String(a.$updatedAt),
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
    }),
  );

  const typedAnswers: AnswerList = {
    total: Number((answersRaw as any).total ?? 0),
    documents: typedAnswersDocs,
  };

  const upvotes = toVoteList(upvotesRaw);
  const downvotes = toVoteList(downvotesRaw);

  const questionImageSrc =
    question.attachmentId && question.attachmentId !== "null"
      ? String(
          storage.getFileView(questionAttachmentBucket, question.attachmentId),
        )
      : "";

  const authorAvatarSrc = String(
    avatars.getInitials(questionAuthor.name, 36, 36),
  );

  return (
    <TracingBeam className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="relative mx-auto w-full pb-20 pt-36">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="min-w-0 flex-1">
            <h1 className="mb-1 break-words text-3xl font-bold">
              {question.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </span>
              <span>Answer {typedAnswers.total}</span>
              <span>Votes {upvotes.total + downvotes.total}</span>
            </div>
          </div>

          <Link
            href="/questions/ask"
            className="inline-block shrink-0 md:ml-auto"
          >
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                Ask a question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        <hr className="my-4 border-white/40" />

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex shrink-0 flex-row items-start gap-4 md:flex-col md:items-center">
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

          <div className="min-w-0 w-full">
            <MarkdownPreview
              className="max-w-full rounded-xl p-4"
              source={question.content}
            />

            {!!questionImageSrc && (
              <picture>
                <img
                  src={questionImageSrc}
                  alt={question.title}
                  className="mt-3 h-auto max-w-full rounded-lg"
                />
              </picture>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {question.tags.map((tag) => (
                <Link
                  key={`${question.$id}-${tag}`}
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
                    questionAuthor.name,
                  )}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {questionAuthor.name}
                </Link>
                <p>
                  <strong>
                    {Number(questionAuthor.prefs?.reputation ?? 0)}
                  </strong>
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
