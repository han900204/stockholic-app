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
const comment = require('./schema/commentSchema');

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
    getComments: comment.query.getComments,
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
    createComment: comment.mutation.postComment,
    deleteComment: comment.mutation.deleteComment,
    updateComment: comment.mutation.updateComment,
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
