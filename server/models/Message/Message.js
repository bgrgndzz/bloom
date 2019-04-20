const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  seen: {
    type: Boolean,
    default: false
  }
});

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 10
};
MessageSchema.plugin(mongoosePaginate);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
