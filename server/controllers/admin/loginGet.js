module.exports = (req, res, next) => {
  if (req.session.admin) {
    res.redirect('/admin/panel');
  }

  res.render('admin/login');
}