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
 * Comment Schema
 */
const comment = {
	type: null,
	query: {},
	mutation: {},
};

comment.type = new GraphQLObjectType({
	name: 'comment',
	fields: () => ({
		id: { type: GraphQLInt },
		owner_user_id: { type: GraphQLInt },
		forum_id: { type: GraphQLInt },
		date_created: { type: DateTime },
		description: { type: GraphQLString },
		likes: { type: GraphQLInt },
		dislikes: { type: GraphQLInt },
		nick_name: { type: GraphQLString },
	}),
});

comment.query.getComments = {
	type: GraphQLList(comment.type),
	args: {
		forum_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectJoinQuery(
			[
				{
					comment: [
						'id',
						'forum_id',
						'description',
						'date_created',
						'owner_user_id',
						'likes',
						'dislikes',
					],
				},
				{ investor: ['nick_name'] },
			],
			[{ comment: 'owner_user_id', investor: 'id' }],
			[{ comment: [`forum_id = ${args.forum_id}`] }],
			{
				comment: 'id',
				option: 'DESC',
			}
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} comments retrieved`);
		return res.rows;
	},
};

comment.mutation.postComment = {
	type: comment.type,
	args: {
		forum_id: { type: GraphQLInt },
		owner_user_id: { type: GraphQLInt },
		description: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getInsertQuery(
			'comment',
			['forum_id', 'owner_user_id', 'description'],
			{
				forum_id: args.forum_id,
				owner_user_id: args.owner_user_id,
				description: args.description,
			},
			[
				'id',
				'forum_id',
				'owner_user_id',
				'description',
				'date_created',
				'likes',
				'dislikes',
			]
		);

		// Create a comment
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
		console.log('comment created', res.rows[0]);
		return res.rows[0];
	},
};

comment.mutation.deleteComment = {
	type: comment.type,
	args: {
		id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getDeleteQuery(
			'comment',
			[`id = '${args.id}'`],
			[
				'id',
				'forum_id',
				'owner_user_id',
				'description',
				'date_created',
				'likes',
				'dislikes',
			]
		);

		// Delete comment
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

		console.log('comment deleted', res.rows[0]);
		return res.rows[0];
	},
};

comment.mutation.updateComment = {
	type: comment.type,
	args: {
		id: { type: GraphQLInt },
		description: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getUpdateQuery(
			'comment',
			args,
			[`id = ${args.id}`],
			[
				'id',
				'forum_id',
				'owner_user_id',
				'description',
				'date_created',
				'likes',
				'dislikes',
			]
		);

		// Update comment
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
		console.log('comment updated', res.rows[0]);

		return res.rows[0];
	},
};

module.exports = comment;
