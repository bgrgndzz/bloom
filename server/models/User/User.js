const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// functions
const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const UserSchema = new Schema({
  auth: {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  user: {
    firstName: {
      type: String, 
      required: true
    },
    lastName: {
      type: String, 
      required: true
    },
    school: {
      type: String, 
      required: true
    },
    about: String,
    profilepicture: String,
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }],
    followingCount: {
      type: Number,
      default: 0
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }],
    followersCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    blocked: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }]
  },
  passwordReset: {
    hash: String
  },
  preSave: {
    type: Boolean,
    default: true
  }
});

UserSchema.pre('save', hashPassword);
UserSchema.methods.verifyPassword = verifyPassword;

mongoosePaginate.paginate.options = { 
  lean: true,
  limit: 20,
  select: 'user'
};
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);

module.exports = User;