const path = require('path');
const utils=require('./build/utils');

//存放项目的文件夹名字
proFolderName='app';

// 打包后的名称，项目名称
const zipname = 'haha';
const actName= 'admin';

let config = {
    // 打包后的文件命名
    'zipName': zipname,
    'proName': actName,
    //存放项目的文件夹名字
    'proFolderName':proFolderName,
    // 是否需要 mock 数据
    'ismock': {
        'development': true,
        'production': true
    },
    // 端口
    'port': 4001,
    // dev 环境下是否需要 babel 解析
    'babel': true,
    //输出位置
    'publicPath':{
        'development': '/',
        'production': '/dmz/' + zipname + '/'
    }
};

// 路径
let rootPath = path.resolve(process.cwd()).replace(/\\/g, '/');
let appPath = rootPath + '/' + proFolderName;
let distRootPath = rootPath + '/dist';
let zipPath = distRootPath + '/zip';
let componentPath = appPath + '/components';
// 不允许存在 html 项目
let htmlPathDic = 'html';
let htmlPath = appPath + '/' + htmlPathDic;

let sassPathDic = 'css';
let sassPath = appPath + '/' + sassPathDic;

let _path = {
    // 根目录
    root: rootPath,
    // 项目开发目录
    app: appPath,
    // 打包根目录
    distRoot: distRootPath,
    // 压缩包目录
    zipRoot: zipPath,
    // sass 打包中转文件夹
    //sassPathDic: sassPathDic,
    // html 文件存放文件夹
    htmlPathDic: htmlPathDic
    // lib 文件夹
    // lib: {
    //     from: './components/libs',
    //     to: './libs'
    // }
};

exports.getPath=function(){
    return _path;
};

exports.getConfigs = function() {
    return config;
};


let acts = getActNames();
/**
 * 获取项目所有的 htmls scripts
 * @info 如果 process.env.actNames 为空，则打包所有的项目；如果需要打包多个项目，则使用 actNames = 项目1,项目2
 */
exports.getBuildFiles = function() {
    let acts = getActNames();//获得项目地址

    // 获取所有 html 文件
    let htmls = [];
    let scripts = [];

    // 遍历项目所有文件
    for (let key1 in acts) {
        // 读取所有 htmls 文件
        try {
            var files = utils.getAllFiles(acts[key1] + '/html', /^(?!.*\/_inc)/);
            for (let key2 in files) {
                htmls.push(files[key2].replace(_path.app, ''));
            }
        } catch (e) { console.log("err:"+e);}

        // 读取所有入口脚本
        try {
            files = utils.getAllFiles(acts[key1] + '/js',null);
            for (let key2 in files) {
                scripts.push(files[key2].replace(_path.app, ''));
            }
        } catch (e) { console.log("err:"+e);}
    }

    return {
        htmls: htmls,
        scripts: scripts
    };
};


/**
 * 获取所有要打包的项目
 */
function getActNames() {
    // 从配制中获取 actNames
    let actNames = actName;
    let acts = [];
    // 如果 actNames 空，则读取 app 下所有文件
    if (actNames == null || actNames === 'null' || actNames === 'undefined') {
        //项目名字为空
    } else {
        let dics = actNames.split(',');
        for (let key in dics) {
            let name = dics[key];
            if (name != null && name !== '') {
                acts.push(_path.app + '/' + dics[key]);
            }
        }
    }

    let result = [];
    for (let key in acts) {
        if (acts[key] === componentPath || acts[key] === htmlPath || acts[key] === sassPath) {
            continue;
        }
        if (utils.isExistsSync(acts[key] + '/html') && utils.isExistsSync(acts[key] + '/js')) {
            result.push(acts[key]);
        }
    }

    return result;
}

exports.getActNames = function() {
    return getActNames();
};


/**
 * 获取静态路由配置项
 */
exports.getStaticRoutes = function() {
    let result = [];

    for (let key in acts) {
        let actPath = acts[key].replace(_path.app, '');
        result.push(actPath + '/images');
        result.push(actPath + '/mock');
        result.push(actPath + '/fonts');
        result.push(actPath + '/media');
    }

    return result;
};

// /**
//  * 获取入口文件
//  * @param scripts 所有的入口文件地址
//  */
exports.getEntryMap=function(buildFiles) {
    let result = {};
    let htmlFiles=buildFiles.htmls;
    for(let key in htmlFiles){
        let urlSplitArr=htmlFiles[key].split('/');
        let actName = urlSplitArr[1];
        let entryFileName=urlSplitArr[urlSplitArr.length-1].replace('.html','');
        result[actName+'/js/'+entryFileName]=['./'+proFolderName+'/'+actName+"/js/"+entryFileName+".js"];
        if (process.env.NODE_ENV === 'development') {
            result[actName+'/js/'+entryFileName].unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
        }
    }

    return result;
};