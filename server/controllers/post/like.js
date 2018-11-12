const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.post) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir paylaşım girdiğinizden emin olun'
    });
  }

  Post
    .findById(req.params.post)
    .exec((err, post) => {
      if (!post) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir paylaşım yok'
        });
      }

      if (post.likes.indexOf(req.user) === -1) {
        post.likes.push(req.user);
        post.save(err => {
          return res.status(200).send({
            authenticated: true,
            liked: true,
            likes: post.likes
          });
        });
      } else {
        return res.status(200).send({
          authenticated: true,
          liked: true,
          likes: post.likes
        });
      }
    });
};