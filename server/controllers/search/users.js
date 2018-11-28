const mongoose = require('mongoose');
const User = require('../../models/User/User');

const elasticSearchSanitize = require('../../util/elasticsearch-sanitize');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.search) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir arama yaptığınızdan emin olun'
    });
  }

  const search = elasticSearchSanitize(req.params.search);

  User.search(
    {
      query_string: {
        query: `*${search}*`,
        allow_leading_wildcard: true
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
          users: []
        });
      }

      const users = results.hits.hits;
      
      res.status(200).send({
        authenticated: true,
        users
      });
    }
  );
};