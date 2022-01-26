// 接口请求相关
const express = require('express');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const xmlBodyParser = require('express-xml-bodyparser');
const app = express();
app.use(xmlBodyParser());

// 接口链接相关
const apiUrl = 'http://www.tuling123.com/openapi/api';
const apiKey = '0e4017d36c9f4cb1b59694f528e73e34';

// 企信消息相关
const aesKey = 'NoHnuhMtRwcBpdw81ycvuMgOg5e23sHsWeqKy1gDi7g';
const wxNotify = require('./wx-notify/index');
const {decrypt} = require('@wecom/crypto');

// xml 解析
const xmlParser = new xml2js.Parser();

// 企信校验
app.get('/', (req, res) => {
  const result = decrypt(aesKey, req.query.echostr);
  res.send(result.message);
});

// 企信消息
app.post('/', (req, appRes) => {
  // 解析得到的xml数据
  xmlParser.parseString(decrypt(aesKey, req.body.xml.encrypt[0]).message, (err, xmlRes) => {
    console.log("ssss0->", xmlRes.xml);
    const FromUserName = xmlRes.xml.FromUserName[0];
    const Content = xmlRes.xml.Content[0];
    console.log("ssss1->", FromUserName, Content);
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        key: apiKey,
        info: Content
      })
    }).then(result => result.json())
      .then(result => {
        console.log("ssss2->", result.text);
        // 直接回复个空数据
        appRes.send('');
        // 获取数据，然后进行消息推送进行发布
        const text = result.text;
        wxNotify({
          touser: FromUserName,
          text: {
            content: text,
          },
        })
      });
  });
});

app.listen(3000);
