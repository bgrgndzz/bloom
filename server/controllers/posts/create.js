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

  const newPost = new Post({
    text: req.body.text,
    author: req.user,
    topic: req.params.topic
  });
  newPost.save(err => {
    return res.status(200).send({
      authenticated: true
    });
  });
};