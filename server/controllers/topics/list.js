const moment = require('moment');

const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  Post
    .find()
    .sort('-date')
    .exec((err, posts) => {
      let topics = [];
      posts.forEach(post => {
        const topicNames = topics.map(topic => topic.topic);
        if (topicNames.indexOf(post.topic) === -1) {
          topics.push({
            topic: post.topic,
            posts: 1,
            last: post.date
          });
        } else {
          topics[topicNames.indexOf(post.topic)].posts += 1;
        }
      });
      
      if ((req.params && req.params.sort === 'popular') || (!req.params || !req.params.sort)) {
        // Sorting algorithm 1:
        // ((posts - 1) ^ .8)
        // divided by
        // ((lastPost.minutesAge + 120) ^ 1.4)
        
        topics = topics.sort((prev, cur) => (((prev.posts - 1) ** .8) / ((moment(prev.last).diff(moment(), 'minutes') + 120) ** 1.4)) - ((cur.posts - 1) ** .8) / ((moment(cur.last).diff(moment(), 'minutes') + 120) ** 1.4));
      }

      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};