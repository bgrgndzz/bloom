const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const Comment = require('../../models/Comment/Comment');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.post) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir başlık girdiğinizden emin olun'
    });
  }

  User
    .findById(req.user)
    .select('user')
    .exec((err, self) => {
      Post
        .findOne({
          _id: req.params.post,
          $or: [
            { author: { $nin: self.user.blocked } },
            { anonymous: true }
          ]
        })
        .populate('author', 'user')
        .exec((err, post) => {
          if (!post) {
            return res.status(422).send({
              authenticated: true,
              error: 'Böyle bir paylaşım yok'
            });
          }

          post = {
            ...post._doc,
            liked: post.likes.indexOf(req.user) !== -1,
            author: {
              _id: post.author._id,
              ...post.author._doc.user
            },
          };

          Comment
            .find({
              post: req.params.post,
              $or: [
                { author: { $nin: self.user.blocked } },
                { anonymous: true }
              ]
            })
            .populate('author', 'user')
            .sort({date: -1})
            .exec((err, comments) => {
              comments = comments.map(comment => ({
                ...comment._doc,
                author: {
                  _id: comment.author._id,
                  ...comment.author._doc.user
                }
              }));
              return res.status(200).send({
                authenticated: true,
                post,
                comments
              });
            });
        });
    });
};
