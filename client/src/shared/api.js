module.exports = ({path, method, jwt, body}, callback) => {
  const config = {
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': jwt
    },
    body: JSON.stringify(body),
    method
  };
  const url = 'https://www.bloomapp.tk/' + path;

  fetch(url, config)
    .then(response => response.json())
    .then(response => {
      if (!response.authenticated) return callback('unauthenticated');
      if (response.error) return callback(response.error);
      return callback(null, response);
    })
    .catch(callback);
};