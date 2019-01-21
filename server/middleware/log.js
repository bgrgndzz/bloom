const mongoose = require('mongoose');
const Log = require('../models/Log/Log');

module.exports = (req, res, next) => {
  const newLog = new Log({
    user: req.user,
    path: req.originalUrl
  });

  newLog.save(err => {
    next();
  });
};