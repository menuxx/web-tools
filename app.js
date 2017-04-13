// http://expressjs.com/en/4x/api.html#router
const express = require('express')
const logger = require('morgan')
const request = require('request')
const config = require('./config')
const favicon = require('serve-favicon')
const mysql = require('mysql')
const path = require('path')

const {isEmpty} = require('lodash')
const NodeCache = require('node-cache')

const myCache = new NodeCache( { stdTTL: 6000, checkperiod: 120 } )

const app = express()

app.use(logger('dev'))
app.use(favicon(__dirname + '/public/menuxx.ico'))
app.use('/', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
// http://twitter.github.io/hogan.js/
app.set('view cache', !config.DEBUG)
app.set('view engine', 'hjs')

var pool = mysql.createPool({
  host     : config.dbHost,
  user     : config.dbUser,
  password : config.dbPassword,
  database : config.dbName,
  port     : config.dbPort
})

var router = express.Router()

// 将变量注入到视图中
app.locals.contextPath = config.contextPath
app.locals.baseUrl = config.baseUrl

app.use(config.contextPath, router)

router.get('/', function (req, resp) {
  
  resp.render('index')
})

router.get('/access_token', function (req, resp) {
  var {appId, appSecret} = req.query
  var cacheKey = `access_token:${appId}`
  if ( isEmpty(appId) || isEmpty(appSecret) ) {
    resp.json({errMsg: '无效的AppId或AppSecret'})
    return
  }
  var cachedAccessToken = myCache.get(cacheKey)
  if ( !isEmpty(cachedAccessToken) ) {
    resp.json(cachedAccessToken)
    return
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

router.get('/get_table_qrcode', function (req, resp) {
  var {access_token, path} = req.query
  request.post(`https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${access_token}`, {
    body: { "path": decodeURIComponent(path), "width": 800 },
    json: true,
  }).pipe(resp)
})

app.listen(config.serverPort, function () {
  console.log(`server running on ${config.serverPort}`)
})