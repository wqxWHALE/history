const express = require('express');
const http = require('http');
const webpack = require('webpack');
const del = require('del');
const configs = require('./config');
const utils=require('./build/utils');
// 热更新
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const nunjucks=require('nunjucks');


const config = configs.getConfigs();
const buildFiles = configs.getBuildFiles();//获取js,html 路径
const staticRoutes = configs.getStaticRoutes();//获取资源文件
const actNames = configs.getActNames();
const pathConfig=configs.getPath();
const entryMap=configs.getEntryMap(buildFiles);

//获取端口和IP
const port = config.port;
process.env.ip = utils.getIp();
process.env.port = port;

// 获取配置文件
console.log("入口文件：");
console.log(entryMap);
console.log("构建目标：");
console.log(buildFiles);

let app=express();

// 设置视图文件夹，设置视图后缀名，设置 html 文件由 nunjucks 模板引擎管理
app.set('view engine', 'html');
app.set('views','./app');
//app.engine("html",ejs.render);
app.engine('html', nunjucks.render);

// 环境 env production development
let env = process.env.NODE_ENV != null ? process.env.NODE_ENV : 'production';

//包存放路径
let publicPath = config.publicPath[env] == null ? '/' : config.publicPath[env];


const zipName = config.zipName;

process.env.zipName = zipName;
process.env.publicPath = publicPath;

console.log("zipName:"+zipName);
console.log("publicPath:"+publicPath);
console.log("actNames:"+actNames);


if (env === 'development') {
    // 开发环境
    buildDev();
} else {
    // 打包非 dev 环境
    build();
}


/**
 * 启动开发环境
 */
function buildDev() {

    // 定义路由器,引入js,css资源
    require('./build/route.dev')(app, buildFiles.htmls);
    // 创建服务器
    let server = http.createServer(app);

    // 装载 webpack 容器
    let webpackConfig= require('./build/webpack.dev.config').getDevConfigs(entryMap);
    let compiler = webpack(webpackConfig);

    // 链接 webpack 服务器
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        hot: true,
        inline: true,
        publicPath: publicPath
    }));
    app.use(webpackHotMiddleware(compiler));

    // 配置静态文件服务器
    for (let key in staticRoutes) {
        app.use(staticRoutes[key], express.static(pathConfig.app + staticRoutes[key]));
    }

    server.listen(port, '0.0.0.0', function onStart(err) {
        if (err) {
            console.log(err);
        }
        console.log('启动成功');
    });
}

/**
 * 打包非开发环境
 */
function build() {
    // 删除 zipName
    console.log('remove old dist begin：' + new Date().toLocaleTimeString());
    del.sync(pathConfig.distRoot);
    console.log('remove old dist success：' + new Date().toLocaleTimeString());

    console.log('begin build：' + new Date().toLocaleTimeString());
    // 打包文件
    let webpackConfig= require('./build/webpack.prod.config').getProdConfigs(entryMap);
    webpack(webpackConfig, function() {
        console.log("打包成功");
    });
}

