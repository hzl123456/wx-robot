const express = require('express');
const fetch = require('node-fetch');
const xmlParser = require('express-xml-bodyparser');
const {getSignature, encrypt, decrypt} = require('@wecom/crypto');

const app = express();
app.use(xmlParser());
const apiUrl = 'http://www.tuling123.com/openapi/api';
const apiKey = '0e4017d36c9f4cb1b59694f528e73e34';

// 企信校验相关
const token = 'rPUwKQhhJfa1XqyHCB1QXB5';
const aesKey = 'NoHnuhMtRwcBpdw81ycvuMgOg5e23sHsWeqKy1gDi7g';

// 企信校验
app.get('/', (req, res) => {
  const result = decrypt(aesKey, req.query.echostr);
  res.send(result.message);
});

// 企信消息
app.post('/', (req, res) => {
  // 加密的数据
  console.log("ssss1->", req.body.xml);
  const info = decrypt(aesKey, req.body.xml.encrypt[0]).message;
  console.log("ssss2->", info);
  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({
      key: apiKey,
      info
    })
  }).then(result => result.json())
    .then(result => {
      // 进行一个消息的回复
      try {
        console.log("ssss3->", result);
        const Nonce = "123456";
        const TimeStamp = Date.now();
        const Encrypt = encrypt(aesKey, result.text, Nonce);
        const MsgSignature = getSignature(token, TimeStamp, Nonce, Encrypt);
        const sendResult = `<xml>
   <Encrypt>${Encrypt}</Encrypt>
   <MsgSignature>${MsgSignature}</MsgSignature>
   <TimeStamp>${TimeStamp}</TimeStamp>
   <Nonce>${Nonce}</Nonce>
</xml>`;
        console.log("ssss4->", sendResult);
        res.send(sendResult);
      } catch (e) {
        console.error("error:", e);
        res.send('')
      }
    });
});

app.listen(3000);
