import { DocumentNode } from 'graphql';

/**
 * GraphQL Query Interface
 */
export interface QueryInterface {
  CREATE_INVESTOR_QUERY: DocumentNode;
  CREATE_AUTH_QUERY: DocumentNode;
  GET_AUTHENTICATION_QUERY: DocumentNode;
  VALIDATE_INVESTOR_QUERY: DocumentNode;
  GET_INVESTOR_QUERY: DocumentNode;
  DELETE_AUTH_QUERY: DocumentNode;
  GET_FORUMS_QUERY: DocumentNode;
  CREATE_FORUM_QUERY: DocumentNode;
  DELETE_FORUM_QUERY: DocumentNode;
  UPDATE_FORUM_QUERY: DocumentNode;
  GET_FORUM_QUERY: DocumentNode;
  GET_COMMENTS_QUERY: DocumentNode;
  CREATE_COMMENT_QUERY: DocumentNode;
  UPDATE_COMMENT_QUERY: DocumentNode;
  DELETE_COMMENT_QUERY: DocumentNode;
}

/**
 * Investor / Authentication Interfaces
 */
export interface CreateInvestorPayload {
  first_name: string;
  last_name: string;
  nick_name: string;
  email: string;
  password: string;
}

export interface CreateAuthPayload {
  investor_id: number | null;
}

export interface GetAuthPayload {
  token: string | null;
}

export interface ValidateInvestorPayload {
  email: string;
  password: string;
}

/**
 * Forum Interfaces
 */

export interface ForumData {
  id: number;
  name: string;
  description: string;
  date_created: string;
  nick_name: string;
  owner_user_id: number;
}
export interface GetForumsResponse {
  getForums: ForumData[];
}

export interface GetForumResponse {
  getForum: ForumData;
}

export interface GetForumPayload {
  id: number;
}

export interface CreateForumResponse {
  createForum: ForumData;
}

export interface CreateForumPayload {
  owner_user_id: number;
  name: string;
  description: string | null;
}

export interface UpdateForumResponse {
  updateForum: ForumData;
}

export interface UpdateForumPayload {
  id: number;
  name?: string;
  description?: string;
}

export interface DeleteForumResponse {
  deleteForum: ForumData;
}

export interface DeleteForumPayload {
  id: number;
}

/**
 * Comment Interfaces
 */

export interface CommentData {
  id: number;
  owner_user_id: number;
  forum_id: number;
  date_created: string;
  description: string;
  likes: string;
  dislikes: string;
  nick_name;
}

export interface GetCommentsResponse {
  getComments: CommentData[];
}

export interface GetCommentsPayload {
  forum_id: number;
}

export interface CreateCommentResponse {
  createComment: CommentData;
}

export interface CreateCommentPayload {
  owner_user_id: number;
  forum_id: number;
  description: string;
}

export interface UpdateCommentResponse {
  updateComment: CommentData;
}

export interface UpdateCommentPayload {
  id: number;
  description: string;
}

export interface DeleteCommentResponse {
  deleteComment: CommentData;
}

export interface DeleteCommentPayload {
  id: number;
}
