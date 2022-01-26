const express = require('express');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const xmlBodyParser = require('express-xml-bodyparser');
const {getSignature, encrypt, decrypt} = require('@wecom/crypto');

const app = express();
app.use(xmlBodyParser());
const apiUrl = 'http://www.tuling123.com/openapi/api';
const apiKey = '0e4017d36c9f4cb1b59694f528e73e34';

// 企信校验相关
const token = 'rPUwKQhhJfa1XqyHCB1QXB5';
const aesKey = 'NoHnuhMtRwcBpdw81ycvuMgOg5e23sHsWeqKy1gDi7g';

// xml 解析
const xmlParser = new xml2js.Parser();
const xmlBuilder = new xml2js.Builder({rootName: 'xml', xmldec: ''});

// 企信校验
app.get('/', (req, res) => {
  const result = decrypt(aesKey, req.query.echostr);
  res.send(result.message);
});

// 企信消息
app.post('/', (req, appRes) => {
  // 解析得到的xml数据
  xmlParser.parseString(decrypt(aesKey, req.body.xml.encrypt[0]).message, (err, xmlRes) => {
    console.log("ssss1->", xmlRes.xml);
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        key: apiKey,
        info: xmlRes.xml.Content[0]
      })
    }).then(result => result.json())
      .then(result => {
        // 进行一个消息的回复
        try {
          console.log("ssss2->", result);
          const Nonce = "123456";
          const TimeStamp = Date.now();
          const Encrypt = encrypt(aesKey, result.text, Nonce);
          const MsgSignature = getSignature(token, TimeStamp, Nonce, Encrypt);
          const sendResult = xmlBuilder.buildObject({
            Nonce: `<![CDATA[${Nonce}]]>`,
            TimeStamp,
            Encrypt: `<![CDATA[${Encrypt}]]>`,
            MsgSignature: `<![CDATA[${MsgSignature}]]>`,
          }).toString()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace('<?xml version="1.0"?>\n', '');
          console.log("ssss3->", sendResult);
          appRes.send(sendResult);
        } catch (e) {
          console.error("error:", e);
          appRes.send('')
        }
      });
  });

});

app.listen(3000);
