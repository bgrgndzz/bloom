const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
});

module.exports = mongoose.model('Post', PostSchema);