const db = require('../db');
const sql = require('../../snippets/sqlQueryGenerator');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLFloat,
} = require('graphql');
const DateTime = require('./customScalar/DateTime');

/**
 * Forum Schema
 */
forum = {
  type: null,
  query: {},
  mutation: {},
};

forum.type = new GraphQLObjectType({
  name: 'forum',
  fields: () => ({
    id: { type: GraphQLInt },
    owner_user_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    date_created: { type: DateTime },
  }),
});

forum.query.getForums = {
  type: forum.type,
  async resolve(parent, args) {
    const sqlQuery = sql.getSelectQuery('forum', ['*']);
    const res = await db.query(sqlQuery);
    return res.rows[0];
  },
};

forum.mutation.postForum = {
  type: forum.type,
  args: {
    owner_user_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getInsertQuery(
      'forum',
      ['owner_user_id', 'name', 'description'],
      {
        owner_user_id: args.owner_user_id,
        name: args.name,
        description: args.description,
      }
    );
    const res = await db.query(sqlQuery[0], sqlQuery[1]);
    console.log('forum created', res.rows[0]);
    return res.rows[0];
  },
};

forum.mutation.deleteForum = {
  type: forum.type,
  args: {
    id: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getDeleteQuery('forum', [`id = '${args.id}'`], ['id']);
    const res = await db.query(sqlQuery);
    console.log('forum deleted', res.rows[0]);
    return res.rows[0];
  },
};

forum.mutation.updateForum = {
  type: forum.type,
  args: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getUpdateQuery(
      'forum',
      args,
      [`id = ${args.id}`],
      ['name', 'description']
    );
    console.log(sqlQuery);

    const res = await db.query(sqlQuery);
    console.log('forum updated', res.rows[0]);

    return res.rows[0];
  },
};

module.exports = forum;
