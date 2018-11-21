const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  User
    .findById(req.user)
    .select('user')
    .exec((err, user) => {
      if (!user) {
        return res.status(403).send({
          authenticated: false, 
          error: 'Bu sayfayı görüntülemek için giriş yapmanız gerekir'
        });
      }

      Post
        .find({
          author: {
            $in: user.user.following
          }
        })
        .populate('author', 'user')
        .sort({date: -1})
        .exec((err, posts) => {
          posts = posts.map(post => ({
            id: post.id,
            ...post._doc,
            liked: post.likes.indexOf(req.user) !== -1,
            author: {
              id: post.author.id,
              ...post.author._doc.user
            }
          }));
          res.status(200).send({
            authenticated: true,
            posts
          });
        });
    });
};