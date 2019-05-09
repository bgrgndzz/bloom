const mongoosePaginate = require('mongoose-paginate');
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
    type: String
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

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 10,
  populate: 'author'
};
PostSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
