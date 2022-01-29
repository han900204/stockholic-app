const db = require('../db');
const sql = require('../../snippets/sqlQueryGenerator');
const { generateToken } = require('../../snippets/encryption');
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
 * Authentication Schema
 */
authentication = {
  type: {},
  query: {},
  mutation: {},
};

authentication.type = new GraphQLObjectType({
  name: 'authentication',
  fields: () => ({
    id: { type: GraphQLInt },
    investor_id: { type: GraphQLInt },
    token: { type: GraphQLString },
    date_created: { type: DateTime },
  }),
});

authentication.query.getAuthentication = {
  type: authentication.type,
  args: {
    token: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getSelectQuery(
      'authentication',
      ['*'],
      [`token = '${args.token}'`]
    );
    const res = await db.query(sqlQuery);
    return res.rows[0];
  },
};

authentication.mutation.postAuthentication = {
  type: authentication.type,
  args: {
    investor_id: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    const token = await generateToken();
    const sqlQuery = sql.getInsertQuery(
      'authentication',
      ['investor_id', 'token'],
      {
        investor_id: args.investor_id,
        token: token,
      }
    );
    const res = await db.query(sqlQuery[0], sqlQuery[1]);
    console.log('token created', res.rows[0]);
    return res.rows[0];
  },
};

authentication.mutation.deleteAuthentication = {
  type: authentication.type,
  args: {
    token: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getDeleteQuery(
      'authentication',
      [`token = '${args.token}'`],
      ['token']
    );
    const res = await db.query(sqlQuery);
    console.log('token deleted', res.rows[0]);
    return res.rows[0];
  },
};

module.exports = authentication;
