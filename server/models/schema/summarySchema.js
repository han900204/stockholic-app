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
 * Summary Schema
 */
const summary = {
	type: null,
	query: {},
};

summary.type = new GraphQLObjectType({
	name: 'summary',
	fields: () => ({
		id: { type: GraphQLInt },
		symbol: {},
		sector: {},
	}),
});

summary.query.getSummaries = {
	type: GraphQLList(summary.type),
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectJoinQuery(
			[
				{
					stock_summary: ['*'],
				},
				{
					symbol: [],
				},
			],
			[{ stock_summary: 'symbol_id', symbol: 'id' }],
			[{ symbol: ['is_active = True'] }],
			{
				stock_summary: 'id',
				option: 'ASC',
			}
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} summaries retrieved`);
		return res.rows;
	},
};

module.exports = summary;
