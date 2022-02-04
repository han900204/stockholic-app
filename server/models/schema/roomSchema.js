const { Room } = require('../mongoModels/roomModel');
const { Message } = require('../mongoModels/messageModel');
const mongoose = require('mongoose');

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
room = {
  type: null,
  query: {},
  mutation: {},
};

const childMessagesType = new GraphQLObjectType({
  name: 'childMessages',
  fields: () => ({
    _id: { type: GraphQLID },
    sender_id: { type: GraphQLInt },
    nick_name: { type: GraphQLString },
  }),
});

room.type = new GraphQLObjectType({
  name: 'room',
  fields: () => ({
    _id: { type: GraphQLID },
    owner_user_id: { type: GraphQLInt },
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
    const rooms = await Room.find({
      owner_user_id: args.owner_user_id,
    }).populate('messages', ['sender_id', 'nick_name']);
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
  },
  async resolve(parent, args) {
    const room = await Room.create({
      owner_user_id: args.owner_user_id,
      nick_name: args.nick_name,
      name: args.name,
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
    return room;
  },
};

module.exports = room;
