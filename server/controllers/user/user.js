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
      if (!user) {
        return res.status(422).send({
          authenticated: true, 
          error: 'Böyle bir kullanıcı yok'
        });
      }
      User
        .findById(req.user)
        .select('user')
        .exec((err, self) => {
          if (self.user.blocked.indexOf(req.params.user) !== -1) {
            return res.status(422).send({
              authenticated: true, 
              error: 'Böyle bir kullanıcı yok'
            });
          }
          
          Post
            .find({author: req.params.user})
            .sort('-date')
            .exec((err, posts) => {
              res.status(200).send({
                authenticated: true,
                user: {
                  id: user.id,
                  ...user._doc.user,
                  posts: posts
                    .filter(post => !post.anonymous)
                    .map(post => ({
                      id: post.id,
                      ...post._doc,
                      liked: post.likes.indexOf(req.user) !== -1
                    })),
                  postCount: posts.length,
                  likeCount: posts.reduce((reducer, post) => reducer += post.likeCount, 0),
                  followersCount: user.user.followersCount,
                  followed: user.user.followers.indexOf(req.user) >= 0
                }
              });
            });
        })
    });
};