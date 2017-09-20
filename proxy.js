var request = require('request')
var cache = require('memory-cache')

// 加载模块
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var ejs = require('ejs');
// 设置端口 (PORT=4000 node app.js)
var port = process.env.PORT || 3000
// express实例
var app = express()

// 设置视图根目录
app.set('views', './views')
// 设置默认模板引擎
app.engine('html',ejs.__express);
app.set('view engine', 'html')
// 静态资源目录
app.use(express.static(path.join(__dirname, 'public')))

// 表单数据格式化
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(jsonParser)
app.use(urlencodedParser)


var cookie = require('cookie-parser');
app.use(cookie())

// 监听端口
// app.listen(port)
// 打印成功日志
// console.log('>>>>>> node started on port ' + port);
var uuid = require('node-uuid')
// 请求登录
function login () {
    console.log('登录中...')

    request({
        uri: `http://test.x.shinho.net.cn/hq/api/login/sign_in?ticket=${uuid.v1()}&access_token=null`,
        method: 'POST',
        body: JSON.stringify({account: "123", password: "8888"}),
        headers: {
            'Content-Type':'application/json'
        }
        }, function (error, response, body) {
        if (error) {
          return console.error('upload failed:', error);
        }
        cache.put('access_token', JSON.parse(body).data.access_token)
        repair()
        console.log('access_token: %s', JSON.parse(body).data.access_token)
    })
}

// 报修单列表
function repair () {
    request({
        uri: `http://test.x.shinho.net.cn/hq/api/repair/query?ticket=${uuid.v1()}&access_token=${cache.get('access_token')}`,
        method: 'POST',
        body: JSON.stringify({account: "123", password: "8888"}),
        headers: {
            'Content-Type':'application/json'
        }
        }, function (error, response, body) {
        if (error) {
          return console.error('upload failed:', error);
        }

        // 未登录
        var body = JSON.parse(body)
        if (body.code == 1000 && body.errmsg == "请登录") {
            login()
        }
        else if (body.data.length) {
            body.data.forEach(function(item, index) {
               if (index == 55) dispose(item)
            })
        }
    })
}

// 处理
function dispose (item) {
    item.upload_data = JSON.parse(item.upload_data)
    console.log('请求处理1条异常订单中...')

    request({
        uri: `http://test.x.shinho.net.cn/hq/api/repair/dispose?ticket=${uuid.v1()}&access_token=${cache.get('access_token')}`,
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            'Content-Type':'application/json'
        }
        }, function (error, response, body) {
        if (error) {
          return console.error('upload failed:', error);
        }
        console.log('----------------------------------')
        console.log(body)
    })
}

setInterval(function() {
  repair()
}, 1800000)
repair()
