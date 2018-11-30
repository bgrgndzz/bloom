const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');

const elasticSearchSanitize = require('../../util/elasticsearch-sanitize');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.search) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir arama yaptığınızdan emin olun'
    });
  }

  const search = elasticSearchSanitize(req.params.search);

  Post.search(
    {
      query_string: {
        query: `*${search}*`,
        allow_leading_wildcard: true,
        fields: ['topic']
      }
    },
    {
      from: 0,
      size: 10000,
      hydrate: true
    },
    (err, results) => {
      if (!results) {
        return res.status(200).send({
          authenticated: true,
          posts: []
        });
      }

      const posts = results.hits.hits;
      
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
      
      topics = topics.sort((prev, cur) => cur.posts - prev.posts);

      res.status(200).send({
        authenticated: true,
        topics
      });
    }
  );
};