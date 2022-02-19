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
		symbol_id: { type: GraphQLInt },
		name: { type: GraphQLString },
		sector: { type: GraphQLString },
		long_business_summary: { type: GraphQLString },
		current_price: { type: GraphQLFloat },
		recommendation_key: { type: GraphQLString },
		target_mean_price: { type: GraphQLFloat },
		earnings_growth: { type: GraphQLFloat },
		current_ratio: { type: GraphQLFloat },
		debt_to_equity: { type: GraphQLFloat },
		return_on_equity: { type: GraphQLFloat },
		short_name: { type: GraphQLString },
		price_to_book: { type: GraphQLFloat },
		forward_pe: { type: GraphQLFloat },
		dividend_yield: { type: GraphQLFloat },
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
					symbol: ['name'],
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
		console.log(res.rows);
		console.log(`${res.rows.length} summaries retrieved`);
		return res.rows;
	},
};

module.exports = summary;
