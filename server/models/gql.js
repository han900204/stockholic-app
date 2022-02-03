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
const forum = require('./schema/forumSchema');

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
    getAuthentication: authentication.query.getAuthentication,
    getForums: forum.query.getForums,
    getForum: forum.query.getForum,
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createInvestor: investor.mutation.postInvestor,
    validateInvestor: investor.mutation.validateInvestor,
    createAuthentication: authentication.mutation.postAuthentication,
    deleteAuthentication: authentication.mutation.deleteAuthentication,
    createForum: forum.mutation.postForum,
    deleteForum: forum.mutation.deleteForum,
    updateForum: forum.mutation.updateForum,
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
