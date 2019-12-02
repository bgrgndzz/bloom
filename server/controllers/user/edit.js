const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  User
    .findById(req.user)
    .exec((err, user) => {
      if (!user) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir kullanıcı yok'
        });
      }

      user.user.mainBadge = req.body.badge || '';
      if (req.body.about) user.user.about = req.body.about;
      if (req.body.profilepicture) {
        const filename = `${req.user}_${Math.round((new Date()).getTime() / 1000)}.${req.body.profilepicture.mime.replace('image/', '')}`;
        const filepath = path.join(__dirname, `../../public/uploads/profilepictures/${filename}`);

        fs.writeFile(filepath, req.body.profilepicture.data, 'base64', err => {
          user.user.profilepicture = filename;
          user.save(err => {
            return res.status(200).send({
              authenticated: true
            });
          });
        });
      } else {
        user.save(err => {
          return res.status(200).send({
            authenticated: true
          });
        });
      }
    });
};
