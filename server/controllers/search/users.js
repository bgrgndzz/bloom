const mongoose = require('mongoose');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.search) {
    res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir arama yaptığınızdan emin olun'
    });
  }

  const search = new RegExp(req.params.search.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'gi');

  User
    .aggregate([
      {$project: {
        auth: 0,
        preSave: 0
      }},
      {$addFields: { 
        user: {
          fullName: {$concat: ['$user.firstName', ' ', '$user.lastName']}
        }
      }},
      {$match: {'user.fullName': search}}
    ])
    .exec((err, results) => {
      console.log(results);
      if (!results) {
        return res.status(200).send({
          authenticated: true,
          users: []
        });
      }
      
      res.status(200).send({
        authenticated: true,
        users: results
      });
    });
};