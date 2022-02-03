import { gql } from '@apollo/client';
import { QueryInterface } from './GQL_INTERFACE';

const GQL_QUERY: QueryInterface = {
  CREATE_INVESTOR_QUERY: gql`
    mutation CreateInvestor(
      $first_name: String!
      $last_name: String!
      $nick_name: String!
      $email: String!
      $password: String!
    ) {
      createInvestor(
        first_name: $first_name
        last_name: $last_name
        nick_name: $nick_name
        email: $email
        password: $password
      ) {
        id
      }
    }
  `,
  CREATE_AUTH_QUERY: gql`
    mutation CreateAuthentication($investor_id: Int!) {
      createAuthentication(investor_id: $investor_id) {
        token
      }
    }
  `,

  GET_AUTHENTICATION_QUERY: gql`
    query GetAuthentication($token: String) {
      getAuthentication(token: $token) {
        investor_id
      }
    }
  `,
  VALIDATE_INVESTOR_QUERY: gql`
    mutation ValidateInvestor($email: String!, $password: String!) {
      validateInvestor(email: $email, password: $password) {
        id
      }
    }
  `,
  GET_INVESTOR_QUERY: gql`
    query GetInvestor($id: Int!) {
      getInvestor(id: $id) {
        id
        first_name
        last_name
        nick_name
        email
        date_created
      }
    }
  `,
  DELETE_AUTH_QUERY: gql`
    mutation DeleteAuthentication($token: String) {
      deleteAuthentication(token: $token) {
        id
      }
    }
  `,

  GET_FORUMS_QUERY: gql`
    query GetForums {
      getForums {
        id
        name
        description
        date_created
        nick_name
        owner_user_id
      }
    }
  `,

  GET_FORUM_QUERY: gql`
    query GetForum($id: Int!) {
      getForum(id: $id) {
        id
        name
        owner_user_id
        description
        date_created
        nick_name
      }
    }
  `,

  CREATE_FORUM_QUERY: gql`
    mutation CreateForum(
      $owner_user_id: Int!
      $name: String!
      $description: String
    ) {
      createForum(
        owner_user_id: $owner_user_id
        name: $name
        description: $description
      ) {
        id
        name
        description
        date_created
        nick_name
        owner_user_id
      }
    }
  `,
  UPDATE_FORUM_QUERY: gql`
    mutation UpdateForum($id: Int!, $name: String, $description: String) {
      updateForum(id: $id, name: $name, description: $description) {
        id
        name
        description
        date_created
        nick_name
        owner_user_id
      }
    }
  `,
  DELETE_FORUM_QUERY: gql`
    mutation DeleteForum($id: Int!) {
      deleteForum(id: $id) {
        id
        name
        description
        date_created
        nick_name
        owner_user_id
      }
    }
  `,
};

export default GQL_QUERY;
