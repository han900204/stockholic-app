const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  _room: { type: Schema.Types.ObjectId, ref: 'Room' },
  date_created: { type: Date, default: Date.now },
  sender_id: { type: Number, required: true },
  nick_name: { type: String, required: true },
  message: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message,
};
