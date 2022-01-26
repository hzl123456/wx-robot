const getToken = require('./getToken');
const postMsg = require('./postMsg');

async function wxNotify(config) {
  try {
    // 获取token
    const accessToken = await getToken();
    // 发送消息
    const defaultConfig = {
      msgtype: 'text',
      agentid: 1000002,
      ...config
    }
    const option = {...defaultConfig, ...config};
    const res = await postMsg(accessToken, option);
    console.log('wx:信息发送成功！', res);
    return true
  } catch (error) {
    console.log('wx:信息发送失败！', error);
    return false
  }
}

module.exports = wxNotify;
