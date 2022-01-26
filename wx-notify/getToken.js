const fetch = require('node-fetch');
const BASE_URL = 'https://qyapi.weixin.qq.com';

const getToken = async () => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/cgi-bin/gettoken?corpid=ww92e118fa7f0d8edb&corpsecret=oz5DEmRHx15K8U_cGUWM2G1f3LFBQWEFrMLPtoEZlAs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => result.json())
      .then(response => resolve(response.access_token))
      .catch(reject);
  });
};

module.exports = getToken;
