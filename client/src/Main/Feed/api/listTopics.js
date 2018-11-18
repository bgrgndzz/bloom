module.exports = (jwt, sort, callback) => {
  fetch('http://192.168.1.34:3000/topics/list/' + sort, {
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