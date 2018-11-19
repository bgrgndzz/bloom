const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// functions
const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const UserSchema = new Schema({
  auth: {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    loginCount: {
      type: Number,
      default: 0
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
    hobbies: [String],
    clubs: [String],
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
    }
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

module.exports = mongoose.model('User', UserSchema);