const mongoosePaginate = require('mongoose-paginate');
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
  text: {
    type: String
  },
  seen: {
    type: Boolean,
    default: false
  }
});

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 10,
  populate: 'from'
};
NotificationSchema.plugin(mongoosePaginate);

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
