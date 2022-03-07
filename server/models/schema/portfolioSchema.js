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
 * Portfolio Schema
 */
const portfolio = {
	type: null,
	query: {},
	mutation: {},
};

portfolio.type = new GraphQLObjectType({
	name: 'portfolio',
	fields: () => ({
		id: { type: GraphQLInt },
		investor_id: { type: GraphQLInt },
		name: { type: GraphQLString },
		date_created: { type: DateTime },
	}),
});

portfolio.query.getPortfolios = {
	type: GraphQLList(portfolio.type),
	args: {
		investor_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectQuery(
			'portfolio',
			['*'],
			[`investor_id = ${args.investor_id}`],
			{ fields: ['date_created'], option: 'DESC' }
		);

		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} portfolios retrieved`);
		return res.rows;
	},
};

portfolio.mutation.postPortfolio = {
	type: portfolio.type,
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

portfolio.mutation.deletePortfolio = {
	type: portfolio.type,
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

portfolio.mutation.updatePortfolio = {
	type: portfolio.type,
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

module.exports = portfolio;
