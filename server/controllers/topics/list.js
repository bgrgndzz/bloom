const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  Post
    .find({
      date: {
        $gt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    })
    .sort('-date')
    .exec((err, posts) => {
      let topics = [];
      posts.forEach(post => {
        const topicNames = topics.map(topic => topic.topic);
        if (topicNames.indexOf(post.topic) === -1) {
          topics.push({
            topic: post.topic,
            posts: 1
          });
        } else {
          topics[topicNames.indexOf(post.topic)].posts += 1;
        }
      });
      
      if ((req.params && req.params.sort === 'popular') || (!req.params || !req.params.sort)) {
        topics = topics.sort((prev, cur) => cur.posts - prev.posts);
      }

      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};