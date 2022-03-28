const { Room } = require('../mongoModels/roomModel');
const { Message } = require('../mongoModels/messageModel');
const mongoose = require('mongoose');
const pubsub = require('../../utils/pubsub');
const { withFilter } = require('graphql-subscriptions');
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

		pubsub.publish('ROOM_DELETED', {
			notifyDeletedRoom: room,
			subscribers: room.subscribers,
		});

		console.log('publishing "ROOM_DELETED"');

		return room;
	},
};

room.mutation.addSubscribers = {
	type: room.type,
	args: {
		_id: { type: GraphQLString },
		subscribers: { type: GraphQLList(GraphQLInt) },
		inviter: { type: GraphQLString },
	},
	async resolve(parent, args) {
		// Add subscribers to room
		const room = await Room.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(args._id) },
			{ $addToSet: { subscribers: args.subscribers } },
			{ new: true }
		);
		console.log('subscribers added to the room', room);

		pubsub.publish('ROOM_SUBSCRIBED', {
			subscribeRoom: room,
			subscribers: room.subscribers,
		});

		console.log('publishing "ROOM_SUBSCRIBED"');

		// Notify subscribers joined in chat room
		const sqlQuery = sql.getSelectQuery(
			'investor',
			['nick_name'],
			[`id IN (${args.subscribers.join(', ')})`]
		);
		const res = await db.query(sqlQuery);
		const nicknames = res.rows.map((row) => row.nick_name);
		const message = await Message.create({
			_room: mongoose.Types.ObjectId(args._id),
			sender_id: 0,
			nick_name: 'System_Admin',
			message:
				nicknames.join(', ') +
				` has been subscribed to the room by ${args.inviter}`,
		});

		await Room.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(args._id) },
			{ $push: { messages: message._id } },
			{ new: true }
		);

		console.log('message created', message);

		pubsub.publish('MESSAGE_CREATED', { subscribeMessage: message });

		console.log('publishing "MESSAGE_CREATED"');

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

		pubsub.publish('ROOM_UNSUBSCRIBED', {
			unsubscribeRoom: room,
			subscribers: room.subscribers,
		});

		console.log('publishing "ROOM_UNSUBSCRIBED"');

		// Notify subscribers left in chat room
		const sqlQuery = sql.getSelectQuery(
			'investor',
			['*'],
			[`id = ${args.subscriber}`]
		);
		const res = await db.query(sqlQuery);

		const message = await Message.create({
			_room: mongoose.Types.ObjectId(args._id),
			sender_id: 0,
			nick_name: 'System_Admin',
			message: `${res.rows[0].nick_name} has been unsubscribed from the room`,
		});

		await Room.findOneAndUpdate(
			{ _id: mongoose.Types.ObjectId(args._id) },
			{ $push: { messages: message._id } },
			{ new: true }
		);

		console.log('message created', message);

		pubsub.publish('MESSAGE_CREATED', { subscribeMessage: message });

		console.log('publishing "MESSAGE_CREATED"');

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
				`room subscription filter result:  subscriber id ${variables.subscriber_id}`,
				payload.subscribers.includes(variables.subscriber_id)
			);
			return (
				payload.subscribers.includes(variables.subscriber_id) ||
				payload.subscribeRoom.owner_user_id === variables.subscriber_id
			);
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
				`room unsubscription filter result: subscriber id ${variables.subscriber_id}`,
				payload.subscribers.includes(variables.subscriber_id)
			);
			return (
				payload.subscribers.includes(variables.subscriber_id) ||
				payload.unsubscribeRoom.owner_user_id === variables.subscriber_id
			);
		}
	),
};

room.subscription.notifyDeletedRoom = {
	type: room.type,
	args: {
		subscriber_id: { type: GraphQLInt },
	},
	subscribe: withFilter(
		() => pubsub.asyncIterator('ROOM_DELETED'),
		(payload, variables) => {
			console.log(
				`room delete subscription filter result: subscriber id ${variables.subscriber_id}`,
				payload.subscribers.includes(variables.subscriber_id)
			);
			return payload.subscribers.includes(variables.subscriber_id);
		}
	),
};

module.exports = room;
