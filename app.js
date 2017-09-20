// 加载模块
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var ejs = require('ejs');
// 设置端口 (PORT=4000 node app.js)
var port = process.env.PORT || 3001
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

// 监听端口
app.listen(port)
// 打印成功日志
console.log('>>>>>> node started on port ' + port);

// 路由
app.get('/', function(req, res) {
    res.render('a')
})
app.use("/api", require("proxyhttp")({
    // 内网对应的公网IP(若不设置，默认外网服务)
    "ip": "112.64.124.86",
    // 内网服务地址
    "intranet": "http://localhost:3000",
    // 外网服务地址
    "extranet": "http://192.168.101.7:3011"
}))