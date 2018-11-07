const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  User
    .findById(req.user)
    .select('user')
    .exec((err, user) => {
      Post
        .find({author: req.user})
        .sort('-date')
        .exec((err, posts) => {
          res.status(200).send({
            authenticated: true,
            user: {
              id: user.id,
              ...user._doc.user,
              posts
            }
          });
        });
    });
};