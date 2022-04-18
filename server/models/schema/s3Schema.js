const { Message } = require('../mongoModels/messageModel');
const mongoose = require('mongoose');
const db = require('../db');
const sql = require('../../snippets/sqlQueryGenerator');
const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
	GraphQLFloat,
	GraphQLID,
} = require('graphql');
const aws = require('aws-sdk');

/**
 * S3 Schema
 */
const s3 = {
	type: null,
	query: {},
	mutation: {},
};

s3.type = new GraphQLObjectType({
	name: 's3',
	fields: () => ({
		signedRequest: { type: GraphQLString },
		url: { type: GraphQLString },
	}),
});

s3.mutation.signS3 = {
	type: s3.type,
	args: {
		fileName: { type: GraphQLString },
		fileType: { type: GraphQLString },
		directory: { type: GraphQLString },
	},
	async resolve(parent, { fileName, fileType, directory }) {
		const s3 = new aws.S3({
			signatureVersion: 'v4',
			region: 'us-west-1',
		});

		const s3Params = {
			Bucket: 'stockholic',
			Key: `${directory}/${fileName}`,
			Expires: 60,
			ContentType: fileType,
			ACL: 'public-read',
		};

		const signedRequest = await s3.getSignedUrl('putObject', s3Params);
		const url = `https://stockholic.s3.amazonaws.com/${directory}/${fileName}`;

		return {
			signedRequest,
			url,
		};
	},
};

module.exports = s3;
