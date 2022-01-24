import { gql } from '@apollo/client';
import { QueryInterface } from '../constants/interfaces';

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
    query GetAuthentication($token: String!) {
      getAuthentication(token: $token) {
        investor_id
      }
    }
  `,
  VALIDATE_INVESTOR_QUERY: gql`
    query ValidateInvestor($email: String!, $password: String!) {
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
};

export default GQL_QUERY;
