const axios = require('axios');

async function getToken() {
  const BASE_URL = 'https://qyapi.weixin.qq.com';
  try {
    const response = await axios({
      url: `${BASE_URL}/cgi-bin/gettoken?corpid=ww92e118fa7f0d8edb&corpsecret=oz5DEmRHx15K8U_cGUWM2G1f3LFBQWEFrMLPtoEZlAs`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.access_token
  } catch (error) {
    return ''
  }
}

module.exports = getToken;
