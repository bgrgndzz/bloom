const mongoosePaginate = require('mongoose-paginate');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  topic: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: []
  }],
  likeCount: {
    type: Number,
    default: 0
  }
});

TopicSchema.plugin(mongoosePaginate);

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;