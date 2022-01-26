/**
 * 发送消息通知到企业微信
 */
const axios= require('axios');

const BASE_URL = 'https://qyapi.weixin.qq.com';

const postMsg = async (accessToken, config) => {
  const response = await axios({
    url: `${BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`,
    method: 'POST',
    data: {
      touser: config.touser || '@all',
      ...config
    }
  });
  return response.data
};

module.exports = postMsg;
