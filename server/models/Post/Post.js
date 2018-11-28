const mongoosastic = require('mongoosastic');

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
    required: true,
    es_indexed: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  anonymous: {
    type: Boolean,
    default: false
  }
});

PostSchema.plugin(mongoosastic);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;