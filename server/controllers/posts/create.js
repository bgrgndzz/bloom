const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.topic) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir başlık girdiğinizden emin olun'
    });
  }

  if (!req.body || !req.body.text) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir yazı gönderdiğinizden emin olun'
    });
  }

  Post
    .findOne({
      text: req.body.text,
      author: req.user,
      topic: req.params.topic
    })
    .exec((err, user) => {
      if (user) {
        return res.status(422).send({
          authenticated: true,
          error: 'Bunu zaten paylaştınız'
        });
      }

      const newPost = new Post({
        text: req.body.text,
        author: req.user,
        topic: req.params.topic,
        anonymous: req.body.anonymous
      });
      newPost.save(err => {
        return res.status(200).send({
          authenticated: true
        });
      });
    });
};