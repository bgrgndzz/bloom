const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  Post
    .find()
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
      topics = topics.sort((prev, cur) => prev.posts < cur.posts);

      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};