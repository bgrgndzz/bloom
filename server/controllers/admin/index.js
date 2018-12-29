module.exports = (req, res, next) => {
  res.redirect('/admin/' + (req.session.admin ? 'panel' : 'login'));
}