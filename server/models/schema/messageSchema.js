const { Room } = require('../mongoModels/roomModel');
const { Message } = require('../mongoModels/messageModel');
const mongoose = require('mongoose');
const pubsub = require('./pubsub');
const { withFilter } = require('graphql-subscriptions');

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
	GraphQLFloat,
	GraphQLID,
} = require('graphql');
const DateTime = require('./customScalar/DateTime');

/**
 * Message Schema
 */
const message = {
	type: null,
	query: {},
	mutation: {},
	subscription: {},
};

message.type = new GraphQLObjectType({
	name: 'message',
	fields: () => ({
		_id: { type: GraphQLID },
		_room: { type: GraphQLID },
		sender_id: { type: GraphQLInt },
		nick_name: { type: GraphQLString },
		message: { type: GraphQLString },
		date_created: { type: DateTime },
	}),
});

message.query.getMessages = {
	type: GraphQLList(message.type),
	args: {
		_room: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const messages = await Message.find({
			_room: mongoose.Types.ObjectId(args._room),
		});
		console.log(`${messages.length} messages retrieved`);
		return messages;
	},
};

message.mutation.postMessage = {
	type: message.type,
	args: {
		_room: { type: GraphQLString },
		sender_id: { type: GraphQLInt },
		nick_name: { type: GraphQLString },
		message: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const message = await Message.create({
			_room: mongoose.Types.ObjectId(args._room),
			sender_id: args.sender_id,
			nick_name: args.nick_name,
			message: args.message,
		});

		await Room.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(args._room) },
			{ $push: { messages: message._id } },
			{ new: true }
		);

		console.log('message created', message);

		pubsub.publish('MESSAGE_CREATED', { subscribeMessage: message });

		console.log('publishing "MESSAGE_CREATED"');

		return message;
	},
};

message.mutation.deleteMessage = {
	type: message.type,
	args: {
		_id: { type: GraphQLString },
	},
	async resolve(parent, args) {
		const message = await Message.findOneAndDelete({
			_id: mongoose.Types.ObjectId(args._id),
		});

		await Room.findOneAndUpdate(
			{ _id: message._room },
			{ $pull: { messages: message._id } },
			{ new: true }
		);

		console.log('message deleted', message);
		return message;
	},
};

message.subscription.subscribeMessage = {
	type: message.type,
	args: {
		_room: { type: GraphQLString },
		sender_id: { type: GraphQLInt },
	},
	subscribe: withFilter(
		() => pubsub.asyncIterator('MESSAGE_CREATED'),
		(payload, variables) => {
			console.log(
				'subscription message filter result: ',
				payload.subscribeMessage._room.toString() === variables._room &&
					payload.subscribeMessage.sender_id !== variables.sender_id
			);
			return (
				payload.subscribeMessage._room.toString() === variables._room &&
				payload.subscribeMessage.sender_id !== variables.sender_id
			);
		}
	),
};

module.exports = message;
