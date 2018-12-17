const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
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
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: String
  },
  seen: {
    type: Boolean,
    default: false
  }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;