module.exports = (jwt, callback) => {
  fetch('https://www.bloomapp.tk/notifications/list', {
    headers: {'x-access-token': jwt}
  })
  .then(response => response.json())
  .then(response => {
    if (!response.authenticated) return callback('unauthenticated');
    if (response.error) return callback(response.error);
    return callback(null, response);
  })
  .catch(callback);
};