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

// CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // cookie
    res.header('Access-Control-Allow-Credentials', true)
    next();
}
app.use(allowCrossDomain);

var cookie = require('cookie-parser');
app.use(cookie())

// 监听端口
app.listen(port)
// 打印成功日志
console.log('>>>>>> node started on port ' + port);

// api
app.post('/api', function(req, res) {
    console.log('取得的cookie:'+req.cookies.cook)
    res.json({
        x: 1,
        y: 2,
        z: 3
    })
})