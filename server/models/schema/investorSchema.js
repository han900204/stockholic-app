const db = require('../db');
const sql = require('../../snippets/sqlQueryGenerator');
const { hashPassword, comparePassword } = require('../../snippets/encryption');
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
 * Investor Schema
 */
investor = {
  type: {},
  query: {},
  mutation: {},
};

investor.type = new GraphQLObjectType({
  name: 'investor',
  fields: () => ({
    id: { type: GraphQLInt },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    nick_name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    date_created: { type: DateTime },
  }),
});

investor.query.getInvestor = {
  type: investor.type,
  args: {
    id: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getSelectQuery('investor', ['*'], [`id = ${args.id}`]);
    const res = await db.query(sqlQuery);
    return res.rows[0];
  },
};

investor.query.getInvestors = {
  type: GraphQLList(investor.type),
  async resolve(parent, args) {
    const sqlQuery = sql.getSelectQuery('investor', ['*']);
    const res = await db.query(sqlQuery);
    return res.rows;
  },
};

investor.mutation.postInvestor = {
  type: investor.type,
  args: {
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    nick_name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const schema = [
      'first_name',
      'last_name',
      'nick_name',
      'email',
      'password',
    ];

    const hashPw = await hashPassword(args.password);
    const sqlQuery = sql.getInsertQuery(
      'investor',
      schema,
      {
        ...args,
        password: hashPw,
      },
      [
        'id',
        'first_name',
        'last_name',
        'nick_name',
        'email',
        'password',
        'date_created',
      ]
    );

    try {
      const res = await db.query(sqlQuery[0], sqlQuery[1]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e.constraint);
    }
  },
};

investor.mutation.validateInvestor = {
  type: investor.type,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const sqlQuery = sql.getSelectQuery(
      'investor',
      ['*'],
      [`email = '${args.email}'`]
    );
    const res = await db.query(sqlQuery);

    if (res.rows.length === 0) {
      throw new Error('email_wrong');
    }
    const isPwValid = await comparePassword(
      args.password,
      res.rows[0].password
    );
    if (isPwValid) {
      return res.rows[0];
    } else {
      throw new Error('password_wrong');
    }
  },
};

module.exports = investor;
