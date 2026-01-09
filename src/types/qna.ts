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

// export type BaseDoc = {
//   $id: string;
//   $createdAt: string;
//   $updatedAt: string;
// };

// export type AuthorLite = {
//   $id: string;
//   name: string;
//   reputation: number;
// };

// export type VoteDoc = BaseDoc & {
//   voteStatus: "upvoted" | "downvoted";
//   votedById: string;
//   type: "question" | "answer";
//   typeId: string;
// };

// export type VoteList = {
//   total: number;
//   documents: VoteDoc[];
// };

// export type CommentDoc = BaseDoc & {
//   content: string;
//   authorId: string;
//   type: "question" | "answer";
//   typeId: string;
//   author: AuthorLite;
// };

// export type CommentList = {
//   total: number;
//   documents: CommentDoc[];
// };

// export type AnswerDoc = BaseDoc & {
//   content: string;
//   authorId: string;
//   questionId: string;

//   author: AuthorLite;

//   comments: CommentList;

//   upvotesDocuments: VoteList;
//   downvotesDocuments: VoteList;
// };

// export type AnswerList = {
//   total: number;
//   documents: AnswerDoc[];
// };

// // Used by QuestionCard
// export type QuestionCardDoc = BaseDoc & {
//   title: string;
//   tags: string[];
//   totalVotes: number;
//   totalAnswers: number;
//   author: AuthorLite;
// };

// // src/types/qna.ts
// import type { Models } from "appwrite";

// export type AuthorLite = {
//   $id: string;
//   name: string;
//   reputation: number;
// };

// export type VoteList = Models.DocumentList<Models.Document>;

// export type CommentDoc = Models.Document & {
//   content: string;
//   authorId: string;
//   type: "question" | "answer";
//   typeId: string;
//   author: AuthorLite;
// };

// export type CommentList = Models.DocumentList<CommentDoc>;

// export type AnswerDoc = Models.Document & {
//   content: string;
//   authorId: string;
//   questionId: string;

//   author: AuthorLite;
//   comments: CommentList;

//   upvotesDocuments: VoteList;
//   downvotesDocuments: VoteList;
// };

// export type AnswerList = Models.DocumentList<AnswerDoc>;

// export type QuestionDoc = Models.Document & {
//   title: string;
//   content: string;
//   tags: string[];
//   authorId: string;
//   attachmentId?: string; // allow undefined if optional
// };

// export type QuestionCardDoc = Models.Document & {
//   title: string;
//   tags: string[];
//   totalVotes: number;
//   totalAnswers: number;
//   author: AuthorLite;
// };

//////////////////////////////////
// src/types/qna.ts
import type { Models } from "appwrite";

export type AuthorLite = {
  $id: string;
  name: string;
  reputation: number;
};

// ✅ ADD THIS (used by VoteButtons + API vote result)
export type VoteDoc = Models.Document & {
  voteStatus: "upvoted" | "downvoted";
  votedById: string;
  type: "question" | "answer";
  typeId: string;
};

// ✅ Make VoteList strongly typed (same structure, better typing)
export type VoteList = Models.DocumentList<VoteDoc>;

export type CommentDoc = Models.Document & {
  content: string;
  authorId: string;
  type: "question" | "answer";
  typeId: string;
  author: AuthorLite;
};

export type CommentList = Models.DocumentList<CommentDoc>;

export type AnswerDoc = Models.Document & {
  content: string;
  authorId: string;
  questionId: string;

  author: AuthorLite;
  comments: CommentList;

  upvotesDocuments: VoteList;
  downvotesDocuments: VoteList;
};

export type AnswerList = Models.DocumentList<AnswerDoc>;

export type QuestionDoc = Models.Document & {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId?: string; // allow undefined if optional
};

export type QuestionCardDoc = Models.Document & {
  title: string;
  tags: string[];
  totalVotes: number;
  totalAnswers: number;
  author: AuthorLite;
};
