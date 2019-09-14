const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');
const Ad = require('../../models/Ad/Ad');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.topic) {
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
        .find({
          topic: req.params.topic,
          $or: [
            {author: {$nin: self.user.blocked}},
            {anonymous: true},
          ],
          reportedBy: {$ne: req.user}
        })
        .populate('author', 'user')
        .sort((req.params.sort && req.params.sort === 'new') ? {date: -1} : {likeCount: -1, date: -1})
        .exec((err, posts) => {
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

          const now = new Date();
          Ad
            .find({
              startDate: { $lte: now },
              endDate: { $gte: now },
              types: 'posts'
            })
            .exec((err, ads) => {
              if (ads.length === 0) {
                return res.status(200).send({
                  authenticated: true,
                  posts,
                  ad: {}
                });
              }

              return res.status(200).send({
                authenticated: true,
                posts,
                ad: ads[0]
              });
            });
        });
    });
};
