const fetch = require('node-fetch');
const BASE_URL = 'https://qyapi.weixin.qq.com';

const postMsg = async (accessToken, config) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`, {
      method: 'POST',
      body: JSON.stringify({
        touser: config.touser || '@all',
        ...config
      })
    }).then(result => result.json())
      .then(response => resolve(response))
      .catch(reject);
  })
};

module.exports = postMsg;
