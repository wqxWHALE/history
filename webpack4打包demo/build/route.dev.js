const configs = require('../config');
let htmlPathDic = '/' + configs.getPath().htmlPathDic + '/';

module.exports = (app, list) => {

    // 循环配置路由表
    Array.from(list, (page) => {
        if (page.indexOf(htmlPathDic) >= 0) {
            let idx = page.indexOf(htmlPathDic);
            let act = page.substr(1, idx - 1);
            let key = page.substr(idx + 6);
            console.log('开发环境访问路径：http://' + process.env.ip + ':' + process.env.port + page);

            app.use(page, function(req, res) {
                res.render(page.substr(1),{
                    title:'test',
                    mainJs:'../js/index.js',
                    vendorJs:'../../public/js/vendors.js'
                });
            });
        }
        return page;
    });

    console.log('IP:' + process.env.ip);
    console.log('访问上面路径，访问对应页面');

};
