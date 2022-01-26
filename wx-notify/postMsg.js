const axios = require('axios');
const BASE_URL = 'https://qyapi.weixin.qq.com';

const postMsg = async (accessToken, config) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`,
      method: 'POST',
      data: config
    }).then(response => resolve(response.data))
      .catch(reject);
  })
};

module.exports = postMsg;
