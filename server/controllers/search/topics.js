const mongoose = require('mongoose');
const Topic = require('../../models/Post/Post');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.search) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir arama yaptığınızdan emin olun'
    });
  }

  const search = new RegExp(req.params.search.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'gi');

  Topic
    .find({topic: search})
    .exec((err, results) => {
      if (!results) {
        return res.status(200).send({
          authenticated: true,
          topics: []
        });
      }
      
      res.status(200).send({
        authenticated: true,
        topics: results
      });
    });
}