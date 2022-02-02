import { DocumentNode } from 'graphql';

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
}

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

// Forum Interfaces

export interface ForumData {
  id: number;
  name: string;
  description: string;
  date_created: string;
  nick_name: string;
  owner_user_id: number;
}

export interface GetForumPayload {
  id: number;
}

export interface CreateForumPayload {
  owner_user_id: number;
  name: string;
  description: string | null;
}

export interface CreateForumResponse {
  createForum: ForumData;
}

export interface GetForumsResponse {
  getForums: ForumData[];
}

export interface GetForumResponse {
  getForum: ForumData;
}
