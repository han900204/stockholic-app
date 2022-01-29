import { DocumentNode } from 'graphql';

export interface QueryInterface {
  CREATE_INVESTOR_QUERY: DocumentNode;
  CREATE_AUTH_QUERY: DocumentNode;
  GET_AUTHENTICATION_QUERY: DocumentNode;
  VALIDATE_INVESTOR_QUERY: DocumentNode;
  GET_INVESTOR_QUERY: DocumentNode;
  DELETE_AUTH_QUERY: DocumentNode;
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
