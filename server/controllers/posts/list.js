const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.topic) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir başlık girdiğinizden emin olun'
    });
  }
  
  Post
    .find({topic: req.params.topic})
    .sort('-date')
    .populate('author', 'user')
    .exec((err, posts) => {
      if (posts.length === 0) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir başlık yok'
        });
      }
      posts = posts.map(post => {
        return {
          ...post._doc,
          author: {
            id: post.author.id,
            ...post.author._doc.user
          }
        };
      });

      res.status(200).send({
        authenticated: true,
        posts
      });
    });
};