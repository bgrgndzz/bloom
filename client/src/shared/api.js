import axios from 'axios';

module.exports = ({path, method, jwt, body}, callback) => {
  const config = {
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': jwt
    },
    validateStatus: status => status >= 200 && status < 500,
    url: 'https://www.getbloom.info/' + path,
    data: body,
    method
  };

  axios(config)
    .then(response => {
      if (response.data.error) return callback(response.data.error);
      if (response.status === 200) return callback(null, response.data);
      if (response.status === 403 || !response.data.authenticated) return callback('unauthenticated');
      return callback('Bilinmeyen bir hata oluştu.');
    })
    .catch(error => {
      if (error.response) {
        callback(error.response.status);
      } else if (error.request) {
        callback(error.request._response);
      } else {
        callback('Error ' + error.message);
      }
    });
};
