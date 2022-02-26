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
 * Portfolio Item Schema
 */
const portfolioItem = {
	type: null,
	query: {},
	mutation: {},
};

portfolioItem.type = new GraphQLObjectType({
	name: 'portfolioItem',
	fields: () => ({
		id: { type: GraphQLInt },
		portfolio_id: { type: GraphQLInt },
		symbol_id: { type: GraphQLInt },
		date_created: { type: DateTime },
		date_purchased: { type: DateTime },
		quantity: { type: GraphQLInt },
	}),
});

portfolioItem.query.getPortfolioItems = {
	type: GraphQLList(portfolioItem.type),
	args: {
		portfolio_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectJoinQuery(
			[
				{
					portfolio_item: ['*'],
				},
				{ investor: ['nick_name'] },
			],
			[{ forum: 'owner_user_id', investor: 'id' }],
			[],
			{
				forum: 'id',
				option: 'DESC',
			}
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} portfolios retrieved`);
		return res.rows;
	},
};

portfolioItem.mutation.postPortfolioItem = {
	type: portfolioItem.type,
	args: {
		investor_id: { type: GraphQLInt },
		name: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getInsertQuery(
			'portfolio',
			['investor_id', 'name'],
			{
				investor_id: args.investor_id,
				name: args.name,
			},
			['id', 'investor_id', 'name', 'date_created']
		);

		// Create a portfolio
		const res = await db.query(sqlQuery[0], sqlQuery[1]);

		console.log('portfolio created', res.rows[0]);
		return res.rows[0];
	},
};

portfolioItem.mutation.deletePortfolioItem = {
	type: portfolioItem.type,
	args: {
		id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getDeleteQuery(
			'portfolio',
			[`id = '${args.id}'`],
			['id', 'investor_id', 'name', 'date_created']
		);

		// Delete portfolio
		const res = await db.query(sqlQuery);

		console.log('portfolio deleted', res.rows[0]);
		return res.rows[0];
	},
};

portfolioItem.mutation.updatePortfolioItem = {
	type: portfolioItem.type,
	args: {
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getUpdateQuery(
			'portfolio',
			args,
			[`id = ${args.id}`],
			['id', 'investor_id', 'name', 'date_created']
		);

		// Update portfolio
		const res = await db.query(sqlQuery);

		console.log('portfolio updated', res.rows[0]);
		return res.rows[0];
	},
};

module.exports = portfolioItem;
