const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.school) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir okul seçtiğinizden emin olun'
    });
  }

  const page = parseInt(req.params.page);

  User
    .find({'user.school': req.params.school})
    .select('user.firstName user.lastName user.profilepicture user.mainBadge')
    .exec((err, users) => {
      let idList = users.map(user => user._id);

      User
        .findById(req.user)
        .select('user')
        .exec((err, self) => {
          Post
            .find({author: {$in: idList}})
            .sort('-date')
            .exec((err, posts) => {
              res.status(200).send({
                authenticated: true,
                users,
                likeCount: posts.reduce((reducer, post) => reducer += post.likeCount, 0),
                postCount: posts.length,
                posts: posts
                  .filter(post => !post.anonymous)
                  .slice((page - 1) * 10, page * 10)
                  .map(post => ({
                    id: post.id,
                    ...post._doc,
                    author: {
                      _id: post.author,
                      ...(users.find(user => user._id.toString() === post.author.toString()).user)
                    },
                    liked: post.likes.indexOf(req.user) !== -1
                  })),
              });
            });
        })
    });
};
