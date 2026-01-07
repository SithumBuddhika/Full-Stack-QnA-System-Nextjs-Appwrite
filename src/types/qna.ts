// export type BaseDoc = {
//   $id: string;
//   $createdAt: string;
//   $updatedAt: string;
// };

// export type AuthorShape = {
//   $id: string;
//   name: string;
//   reputation: number;
// };

// export type VoteList = {
//   total: number;
//   documents: BaseDoc[];
// };

// export type CommentDoc = BaseDoc & {
//   content: string;
//   authorId: string;
//   type: "question" | "answer";
//   typeId: string;
//   author: AuthorShape;
// };

// export type CommentList = {
//   total: number;
//   documents: CommentDoc[];
// };

// export type AnswerDoc = BaseDoc & {
//   content: string;
//   authorId: string;
//   questionId: string;
//   author: AuthorShape;
//   comments: CommentList;
//   upvotesDocuments: VoteList;
//   downvotesDocuments: VoteList;
// };

// export type AnswerList = {
//   total: number;
//   documents: AnswerDoc[];
// };

// src/types/qna.ts

export type BaseDoc = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type AuthorLite = {
  $id: string;
  name: string;
  reputation: number;
};

export type VoteDoc = BaseDoc & {
  voteStatus: "upvoted" | "downvoted";
  votedById: string;
  type: "question" | "answer";
  typeId: string;
};

export type VoteList = {
  total: number;
  documents: VoteDoc[];
};

export type CommentDoc = BaseDoc & {
  content: string;
  authorId: string;
  type: "question" | "answer";
  typeId: string;
  author: AuthorLite;
};

export type CommentList = {
  total: number;
  documents: CommentDoc[];
};

export type AnswerDoc = BaseDoc & {
  content: string;
  authorId: string;
  questionId: string;

  author: AuthorLite;

  comments: CommentList;

  upvotesDocuments: VoteList;
  downvotesDocuments: VoteList;
};

export type AnswerList = {
  total: number;
  documents: AnswerDoc[];
};

// Used by QuestionCard
export type QuestionCardDoc = BaseDoc & {
  title: string;
  tags: string[];
  totalVotes: number;
  totalAnswers: number;
  author: AuthorLite;
};
