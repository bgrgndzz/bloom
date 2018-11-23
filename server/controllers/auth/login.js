const mongoose = require('mongoose');
const User = require('../../models/User/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(422).send({
      authenticated: false,
      error: 'Lütfen tüm boşlukları doldurun'
    });
  }

  User
    .findOne({'auth.email': req.body.email})
    .exec((err, userRes) => {
      if (!userRes) {
        return res.status(422).send({
          authenticated: false,
          error: 'Bu e-mail ile kayıtlı bir hesap yok'
        });
      }
      if (!userRes.auth.active) {
        return res.status(422).send({
          authenticated: false,
          error: 'Hesabınız aktif değil'
        });
      }

      bcrypt.compare(req.body.password, userRes.auth.password, (err, passRes) => {
        if (!passRes) {
          return res.status(422).send({
            authenticated: false,
            error: 'Bu şifre geçerli değil'
          });
        }

        userRes.auth.loginCount += 1;
        userRes.save(err => {
          const token = jwt.sign({user: userRes.id}, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 * 365 // a year
          });
          
          res.status(200).send({
            authenticated: true,
            jwt: token
          });
        });
      });
    });
};