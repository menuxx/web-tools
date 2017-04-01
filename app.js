const express = require('express')
const request = require('request')
const {isEmpty} = require('lodash')
const NodeCache = require('node-cache')

const myCache = new NodeCache( { stdTTL: 6000, checkperiod: 120 } )

const app = express()

app.use('/', express.static('./public'))

app.get('/access_token', function (req, resp) {
  var {appId, appSecret} = req.query
  var cacheKey = `access_token:${appId}`
  if ( isEmpty(appId) || isEmpty(appSecret) ) {
    resp.json({errMsg: '无效的AppId或AppSecret'})
    return;
  }
  var cachedAccessToken = myCache.get(cacheKey)
  if ( !isEmpty(cachedAccessToken) ) {
    resp.json(cachedAccessToken)
    return;
  }
  request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`, function(error, response, body) {
    try {
      var accessToken = JSON.parse(body)
      myCache.set(cacheKey, accessToken)
      resp.json(accessToken)
    } catch(e) {
      resp.status(400).json({errMsg: e.message + ", 错误的AppId或AppSecret导致此问题，请检查AppId,AppSecret"})
    }
  })
})

app.get('/get_table_qrcode', function (req, resp) {
  var {access_token, path} = req.query
  request.post(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${access_token}`, {
    body: { "path": decodeURIComponent(path), "width": 800 },
    json: true,
  }).pipe(resp)
})

app.listen(8071, function () {
  console.log('server running on 8071')
})