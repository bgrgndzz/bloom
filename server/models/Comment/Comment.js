const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
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
CommentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
