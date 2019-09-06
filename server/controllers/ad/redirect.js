const mongoose = require('mongoose');
const Ad = require('../../models/Ad/Ad');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.ad) {
    return res.status(404).send({
      authenticated: true,
      error: 'Böyle bir sayfa yok'
    });
  }
  if (!req.params || !req.params.user) {
    return res.status(404).send({
      authenticated: true,
      error: 'Lütfen bir kullanıcı seçin'
    });
  }

  Ad
    .findById(req.params.ad)
    .exec((err, ad) => {
      if (!ad || !(ad.startDate <= new Date() <= ad.endDate)) {
        return res.status(404).send({
          authenticated: true,
          error: 'Böyle bir sayfa yok'
        });
      }

      return res.redirect(ad.link);
    });
};
