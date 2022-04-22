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
const forum = {
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
		nick_name: { type: GraphQLString },
	}),
});

forum.query.getForums = {
	type: GraphQLList(forum.type),
	args: {
		owner_user_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		let filter = [];

		if ('owner_user_id' in args) {
			filter.push({ forum: [`owner_user_id = ${args.owner_user_id}`] });
		}
		const sqlQuery = sql.getSelectJoinQuery(
			[
				{
					forum: ['id', 'name', 'description', 'date_created', 'owner_user_id'],
				},
				{ investor: ['nick_name'] },
			],
			[{ forum: 'owner_user_id', investor: 'id' }],
			filter,
			{
				forum: 'id',
				option: 'DESC',
			}
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} forums retrieved`);
		return res.rows;
	},
};

forum.query.getForum = {
	type: forum.type,
	args: {
		id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectJoinQuery(
			[
				{
					forum: ['id', 'name', 'description', 'date_created', 'owner_user_id'],
				},
				{ investor: ['nick_name'] },
			],
			[{ forum: 'owner_user_id', investor: 'id' }],
			[{ forum: [`id = ${args.id}`] }]
		);
		const res = await db.query(sqlQuery);
		console.log('forum retrieved', res.rows[0]);
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
			},
			['id', 'name', 'description', 'date_created', 'owner_user_id']
		);

		// Create a forum
		const res = await db.query(sqlQuery[0], sqlQuery[1]);

		// Get a nick_name
		const sqlInvestorQuery = sql.getSelectQuery(
			'investor',
			['*'],
			[`id = ${res.rows[0]['owner_user_id']}`]
		);

		const nick_name = await db
			.query(sqlInvestorQuery)
			.then((data) => data.rows[0]['nick_name']);

		res.rows[0]['nick_name'] = nick_name;
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
		const sqlQuery = sql.getDeleteQuery(
			'forum',
			[`id = '${args.id}'`],
			['id', 'name', 'description', 'date_created', 'owner_user_id']
		);

		// Delete forum
		const res = await db.query(sqlQuery);

		// Get a nick_name
		const sqlInvestorQuery = sql.getSelectQuery(
			'investor',
			['*'],
			[`id = ${res.rows[0]['owner_user_id']}`]
		);

		const nick_name = await db
			.query(sqlInvestorQuery)
			.then((data) => data.rows[0]['nick_name']);

		res.rows[0]['nick_name'] = nick_name;

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
			['id', 'name', 'description', 'date_created', 'owner_user_id']
		);

		// Update forum
		const res = await db.query(sqlQuery);

		// Get a nick_name
		const sqlInvestorQuery = sql.getSelectQuery(
			'investor',
			['*'],
			[`id = ${res.rows[0]['owner_user_id']}`]
		);

		const nick_name = await db
			.query(sqlInvestorQuery)
			.then((data) => data.rows[0]['nick_name']);

		res.rows[0]['nick_name'] = nick_name;
		console.log('forum updated', res.rows[0]);

		return res.rows[0];
	},
};

module.exports = forum;
