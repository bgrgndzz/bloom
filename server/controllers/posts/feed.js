const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  const page = parseInt(req.params.page);
  
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

      Post.paginate(
        {
          author: {
            $in: user.user.following
          },
          anonymous: false
        },
        {
          sort: '-date',
          populate: 'author',
          limit: 10,
          page
        },
        (err, posts) => {
          posts = posts.docs.map(post => ({
            ...post,
            liked: post.likes.indexOf(req.user) !== -1,
            author: {
              _id: post.author.id,
              ...post.author.user
            }
          }));
          res.status(200).send({
            authenticated: true,
            posts
          });
        });
    });
};