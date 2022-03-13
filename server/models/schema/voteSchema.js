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
 * Vote Schema
 */
const vote = {
	type: null,
	query: {},
	mutation: {},
};

vote.type = new GraphQLObjectType({
	name: 'vote',
	fields: () => ({
		id: { type: GraphQLInt },
		forum_id: { type: GraphQLInt },
		investor_id: { type: GraphQLInt },
		comment_id: { type: GraphQLInt },
		type: { type: GraphQLString },
		date_created: { type: DateTime },
	}),
});

vote.query.getVotes = {
	type: GraphQLList(vote.type),
	args: {
		forum_id: { type: GraphQLInt },
		investor_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectQuery(
			'vote',
			['*'],
			[`forum_id = ${args.forum_id} AND investor_id = ${args.investor_id}`]
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} votes retrieved`);
		return res.rows;
	},
};

vote.mutation.postVote = {
	type: vote.type,
	args: {
		forum_id: { type: GraphQLInt },
		comment_id: { type: GraphQLInt },
		investor_id: { type: GraphQLInt },
		type: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getInsertQuery(
			'vote',
			['forum_id', 'comment_id', 'investor_id', 'type'],
			{
				forum_id: args.forum_id,
				comment_id: args.comment_id,
				investor_id: args.investor_id,
				type: args.type,
			},
			['id', 'forum_id', 'comment_id', 'investor_id', 'type', 'date_created']
		);
		const res = await db.query(sqlQuery[0], sqlQuery[1]);

		console.log('vote created', res.rows[0]);
		return res.rows[0];
	},
};

vote.mutation.deleteVote = {
	type: vote.type,
	args: {
		id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getDeleteQuery(
			'vote',
			[`id = '${args.id}'`],
			['id', 'forum_id', 'comment_id', 'investor_id', 'type', 'date_created']
		);

		const res = await db.query(sqlQuery);

		console.log('vote deleted', res.rows[0]);
		return res.rows[0];
	},
};

module.exports = vote;
