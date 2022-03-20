const { Room } = require('../mongoModels/roomModel');
const { Message } = require('../mongoModels/messageModel');
const mongoose = require('mongoose');
const pubsub = require('../../utils/pubsub');
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
 * Room Schema
 */
const room = {
	type: null,
	query: {},
	mutation: {},
	subscription: {},
};

const childMessagesType = new GraphQLObjectType({
	name: 'childMessages',
	fields: () => ({
		_id: { type: GraphQLID },
		sender_id: { type: GraphQLInt },
		nick_name: { type: GraphQLString },
		message: { type: GraphQLString },
		date_created: { type: GraphQLString },
	}),
});

room.type = new GraphQLObjectType({
	name: 'room',
	fields: () => ({
		_id: { type: GraphQLID },
		owner_user_id: { type: GraphQLInt },
		subscribers: { type: GraphQLList(GraphQLInt) },
		nick_name: { type: GraphQLString },
		name: { type: GraphQLString },
		date_created: { type: DateTime },
		messages: { type: GraphQLList(childMessagesType) },
	}),
});

room.query.getRooms = {
	type: GraphQLList(room.type),
	args: {
		owner_user_id: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		let rooms = await Room.find({
			$or: [
				{ owner_user_id: args.owner_user_id },
				{ subscribers: args.owner_user_id },
			],
		});

		console.log(`${rooms.length} rooms retrieved`);
		return rooms;
	},
};

room.mutation.postRoom = {
	type: room.type,
	args: {
		owner_user_id: { type: GraphQLInt },
		nick_name: { type: GraphQLString },
		name: { type: GraphQLString },
		subscribers: { type: GraphQLList(GraphQLInt) },
	},
	async resolve(parent, args) {
		const room = await Room.create({
			owner_user_id: args.owner_user_id,
			nick_name: args.nick_name,
			name: args.name,
			subscribers: args.subscribers,
		});
		console.log('room created', room);

		return room;
	},
};

room.mutation.deleteRoom = {
	type: room.type,
	args: {
		_id: { type: GraphQLString },
	},
	async resolve(parent, args) {
		await Message.deleteMany({
			_room: mongoose.Types.ObjectId(args._id),
		});

		const room = await Room.findOneAndDelete({
			_id: mongoose.Types.ObjectId(args._id),
		});

		console.log('room deleted', room);

		pubsub.publish('ROOM_UNSUBSCRIBED', {
			unsubscribeRoom: room,
			subscribers: room.subscribers,
		});

		console.log('publishing "ROOM_UNSUBSCRIBED"');

		return room;
	},
};

room.mutation.addSubscribers = {
	type: room.type,
	args: {
		_id: { type: GraphQLString },
		subscribers: { type: GraphQLList(GraphQLInt) },
	},
	async resolve(parent, args) {
		const room = await Room.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(args._id) },
			{ $addToSet: { subscribers: args.subscribers } },
			{ new: true }
		);
		console.log('subscribers added to the room', room);

		pubsub.publish('ROOM_SUBSCRIBED', {
			subscribeRoom: room,
			subscribers: args.subscribers,
		});

		console.log('publishing "ROOM_SUBSCRIBED"');

		return room;
	},
};

room.mutation.removeSubscriber = {
	type: room.type,
	args: {
		_id: { type: GraphQLString },
		subscriber: { type: GraphQLInt },
	},
	async resolve(parent, args) {
		const room = await Room.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(args._id) },
			{ $pull: { subscribers: args.subscriber } },
			{ new: true }
		);
		console.log('subscriber removed from the room', room);

		return room;
	},
};

room.subscription.subscribeRoom = {
	type: room.type,
	args: {
		subscriber_id: { type: GraphQLInt },
	},
	subscribe: withFilter(
		() => pubsub.asyncIterator('ROOM_SUBSCRIBED'),
		(payload, variables) => {
			console.log(
				'room subscription filter result: ',
				payload.subscribers.includes(variables.subscriber_id)
			);
			return payload.subscribers.includes(variables.subscriber_id);
		}
	),
};

room.subscription.unsubscribeRoom = {
	type: room.type,
	args: {
		subscriber_id: { type: GraphQLInt },
	},
	subscribe: withFilter(
		() => pubsub.asyncIterator('ROOM_UNSUBSCRIBED'),
		(payload, variables) => {
			console.log(
				'room unsubscription filter result: ',
				payload.subscribers.includes(variables.subscriber_id)
			);
			return payload.subscribers.includes(variables.subscriber_id);
		}
	),
};

module.exports = room;
