module.exports = (jwt, topic, sort, callback) => {
  fetch(`http://192.168.1.34:3000/posts/list/${topic}/${sort}`, {
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