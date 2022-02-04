const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  owner_user_id: { type: Number, required: true },
  nick_name: { type: String, required: true },
  name: { type: String, required: true },
  date_created: { type: Date, default: Date.now },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = {
  Room,
};
