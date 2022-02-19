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
 * Price Schema
 */
const price = {
	type: null,
	query: {},
};

price.type = new GraphQLObjectType({
	name: 'price',
	fields: () => ({
		id: { type: GraphQLInt },
		symbol_id: { type: GraphQLInt },
		price: { type: GraphQLFloat },
		date: { type: DateTime },
	}),
});

price.query.getPrices = {
	type: GraphQLList(price.type),
	args: {
		symbol_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectQuery(
			'stock_price',
			['*'],
			[`symbol_id = ${args.symbol_id}`]
		);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} prices retrieved`);
		return res.rows;
	},
};

module.exports = price;
