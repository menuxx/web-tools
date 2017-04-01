const app = require('express')
const request = require('request')
const {isEmpty} = require('lodash')
const NodeCache = require( "node-cache" )
const myCache = new NodeCache( { stdTTL: 6000, checkperiod: 120 } )

app.use('/', express.static('./public'))

app.get('/access_token', function (req, resp) {
  var {appId, appSecret} = req.query
  var cacheKey = `access_token:${appId}`
  if (isEmpty(appId) || isEmpty(appSecret)) {
    resp.json({errMsg: '无效的AppId或AppSecret'})
    return;
  }
  var cachedAccessToken = myCache.get(cacheKey)
  if (!isEmpty(cachedAccessToken) {
    resp.json(cachedAccessToken)
    return;
  }
  request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`, function(error, response, body) {
    var accessToken = JSON.parse(body)
    myCache.set(cacheKey, accessToken)
    resp.json(accessToken)
  })
})

app.get('/get_table_qrcode/:path', function (req, resp) {
  var {accessToken} = req.query
  request.post(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`, {
    body: { "path": req.params.path, "width": 800 },
    json: true,
  }).pipe(resp)
})

app.listen(8071)