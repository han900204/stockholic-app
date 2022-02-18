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
 * Symbol Schema
 */
const symbol = {
	type: null,
	query: {},
};

symbol.type = new GraphQLObjectType({
	name: 'symbol',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		is_active: { type: GraphQLBoolean },
		date_created: { type: DateTime },
	}),
});

symbol.query.getSymbols = {
	type: GraphQLList(symbol.type),
	async resolve(parent, args) {
		const sqlQuery = sql.getSelectQuery('symbol', ['*'], ['is_active = True']);
		const res = await db.query(sqlQuery);
		console.log(`${res.rows.length} symbols retrieved`);
		return res.rows;
	},
};

module.exports = symbol;
