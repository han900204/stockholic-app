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
		quantity: { type: GraphQLInt },
		average_cost: { type: GraphQLFloat },
		current_price: { type: GraphQLFloat },
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
				{ stock_summary: ['current_price'] },
			],
			[{ portfolio_item: 'symbol_id', stock_summary: 'symbol_id' }],
			[],
			{
				portfolio_item: 'date_created',
				option: 'ASC',
			}
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} portfolio items retrieved`);
		return res.rows;
	},
};

portfolioItem.mutation.postPortfolioItem = {
	type: portfolioItem.type,
	args: {
		portfolio_id: { type: GraphQLInt },
		symbol_id: { type: GraphQLInt },
		quantity: { type: GraphQLInt },
		average_cost: { type: GraphQLFloat },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getInsertQuery(
			'portfolio_item',
			['portfolio_id', 'symbol_id', 'quantity', 'average_cost'],
			{
				investor_id: args.investor_id,
				name: args.name,
			},
			[
				'id',
				'portfolio_id',
				'symbol_id',
				'quantity',
				'average_cost',
				'date_created',
			]
		);

		// Create a portfolio item
		const res = await db.query(sqlQuery[0], sqlQuery[1]);

		// Get a current price
		const sqlInvestorQuery = sql.getSelectQuery(
			'stock_summary',
			['current_price'],
			[`symbol_id = ${res.rows[0]['symbol_id']}`]
		);

		const currentPrice = await db
			.query(sqlInvestorQuery)
			.then((data) => data.rows[0]['current_price']);

		res.rows[0]['current_price'] = currentPrice;

		console.log('portfolio item created', res.rows[0]);
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
			'portfolio_item',
			[`id = '${args.id}'`],
			[
				'id',
				'portfolio_id',
				'symbol_id',
				'quantity',
				'average_cost',
				'date_created',
			]
		);

		// Delete portfolio item
		const res = await db.query(sqlQuery);

		// Get a current price
		const sqlInvestorQuery = sql.getSelectQuery(
			'stock_summary',
			['current_price'],
			[`symbol_id = ${res.rows[0]['symbol_id']}`]
		);

		const currentPrice = await db
			.query(sqlInvestorQuery)
			.then((data) => data.rows[0]['current_price']);

		res.rows[0]['current_price'] = currentPrice;

		console.log('portfolio item deleted', res.rows[0]);
		return res.rows[0];
	},
};

portfolioItem.mutation.updatePortfolioItem = {
	type: portfolioItem.type,
	args: {
		id: { type: GraphQLInt },
		quantity: { type: GraphQLString },
		average_cost: { type: GraphQLFloat },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getUpdateQuery(
			'portfolio_item',
			args,
			[`id = ${args.id}`],
			[
				'id',
				'portfolio_id',
				'symbol_id',
				'quantity',
				'average_cost',
				'date_created',
			]
		);

		// Update portfolio item
		const res = await db.query(sqlQuery);

		// Get a current price
		const sqlInvestorQuery = sql.getSelectQuery(
			'stock_summary',
			['current_price'],
			[`symbol_id = ${res.rows[0]['symbol_id']}`]
		);

		const currentPrice = await db
			.query(sqlInvestorQuery)
			.then((data) => data.rows[0]['current_price']);

		res.rows[0]['current_price'] = currentPrice;

		console.log('portfolio item updated', res.rows[0]);
		return res.rows[0];
	},
};

module.exports = portfolioItem;
