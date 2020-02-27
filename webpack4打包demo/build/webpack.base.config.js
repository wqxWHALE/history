// 复制文件
const path = require('path');
// 独立打包文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const webpack = require('webpack');

let configs = require('../config');
const buildFiles = configs.getBuildFiles();
//var utils = require('./utils');

let prodConfig = configs.getConfigs();
let proName=prodConfig.proName;
let devBabel = prodConfig['babel'];

let nodeEnv = process.env.NODE_ENV;

let devMode=true;
let cssMode={
    loader:'style-loader'
};
if(nodeEnv==="production"){
    devMode=false;
    cssMode={
        loader:MiniCssExtractPlugin.loader
    }
}


// 加载器配置
let moduleConfig = {
    // 入口文件查询
    resolve: {
        modules:[path.join(__dirname,'app'),'node_modules'],
        // 默认文件后缀
        extensions: ['*', '.js', '.scss', '.css', '.html','.vue'],
        alias: {
            //确定vue的构建版本
            'vue$':'vue/dist/vue.js'
        },
    },
    // 打包后，脚本文件输出配置
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [ {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 5120,
                    name: 'images/[name].[hash:7].[ext]',
                    publicPath: "/dist/"
                }
            }, {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                        progressive: true,
                        quality: 65
                    },
                    // optipng.enabled: false will disable optipng
                    optipng: {
                        enabled: false,
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 4
                    },
                    gifsicle: {
                        interlaced: false,
                    },
                    // the webp option will enable WEBP
                    webp: {
                        quality: 75
                    }
                }
            }],
        },{
            test: /\.css$/,
            exclude: /(node_modules|bower_components)/,
            use:[
                cssMode,
                {
                    loader:'css-loader',
                    options:{
                        sourceMap:devMode
                    }
                }//,
                // {
                //     loader:'sass-loader',
                //     options:{
                //         sourceMap:devMode
                //     }
                // }
            ]
        },{
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader:'url-loader',
                options: {
                    name: '[name].[hash:7].[ext]',
                    limit: 5120, // fonts file size <= 5KB, use 'base64'; else, output svg file
                    publicPath: "../../public/fonts/",
                    outputPath: "public/fonts/"
                }
            }]
        },{
            test: /\.vue$/,
            exclude: /(node_modules|bower_components)/,
            use: 'vue-loader'
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? proName+'/css/main.css' : proName+'/css/main.[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimizer: [
            // 压缩CSS
            new OptimizeCSSAssetsPlugin({}),
            // 压缩JS
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ],
        // 找到chunk中共享的模块,取出来生成单独的chunk
        splitChunks: {
            chunks: "all",  // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
            cacheGroups: {
                vendors: {  // 抽离第三方插件
                    test: /[\\/]node_modules[\\/]/,     // 指定是node_modules下的第三方包
                    name: "public/js/vendors",
                    priority: -10                       // 抽取优先级
                },
                // utilCommon: {   // 抽离自定义工具库
                //     name: "common",
                //     minSize: 0,     // 将引用模块分离成新代码文件的最小体积
                //     minChunks: 2,   // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
                //     priority: -20
                // }
            }
        },
    }
};

if (devBabel) {
    moduleConfig.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use:{
            loader: 'babel-loader',
            options: {
                "presets": ["@babel/preset-env"]
            }
        }
    });
}


//HtmlWebpackPlugin 添加页面
for(let key in  buildFiles.htmls){
    let urlSpilt=buildFiles.htmls[key].split('/');
    moduleConfig.plugins.unshift(new HtmlWebpackPlugin({
        //template: 'app/admin/html/index.html',
        template:'app'+buildFiles.htmls[key],
        filename:urlSpilt[1]+'/'+urlSpilt[3]
    }));
}

module.exports = moduleConfig;


