const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.user) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir kişi seçtiğinizden emin olun'
    });
  }

  User
    .findById(req.params.user)
    .select('user')
    .exec((err, user) => {
      Post
        .find({author: req.params.user})
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