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
const authentication = {
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
		nick_name: { type: GraphQLString },
		s3_location: { type: GraphQLString },
	}),
});

authentication.query.getAuthentication = {
	type: authentication.type,
	args: {
		token: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectJoinQuery(
			[
				{
					authentication: ['*'],
				},
				{ investor: ['nick_name', 's3_location'] },
			],
			[{ authentication: 'investor_id', investor: 'id' }],
			[{ authentication: [`token = '${args.token}'`] }]
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
			},
			['id', 'token', 'investor_id', 'date_created']
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
