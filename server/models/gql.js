const db = require('./db');
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLFloat,
} = require('graphql');
const investor = require('./schema/investorSchema');
const authentication = require('./schema/authenticationSchema');

/**
 * Load .env file
 */
if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv');
  dotenv.config();
}

/**
 * Root Query
 */
const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getInvestor: investor.query.getInvestor,
    validateInvestor: investor.query.validateInvestor,
    getAuthentication: authentication.query.getAuthentication,
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createInvestor: investor.mutation.postInvestor,
    createAuthentication: authentication.mutation.postAuthentication,
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});