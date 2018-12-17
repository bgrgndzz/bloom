const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.topic) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir başlık girdiğinizden emin olun'
    });
  }

  const sort = (req.params.sort && req.params.sort === 'new') ? 'new' : 'popular';
  const query = Post.find({topic: req.params.topic}).populate('author', 'user');

  query.sort(sort === 'new' ? {date: -1} : {likeCount: -1, date: -1});
  query.exec((err, posts) => {
    if (posts.length === 0) {
      return res.status(422).send({
        authenticated: true,
        error: 'Böyle bir başlık yok'
      });
    }

    posts = posts.map(post => ({
      id: post.id,
      ...post._doc,
      liked: post.likes.indexOf(req.user) !== -1,
      author: {
        _id: post.author.id,
        id: post.author.id,
        ...post.author._doc.user
      }
    }));
    res.status(200).send({
      authenticated: true,
      posts
    });
  });
};