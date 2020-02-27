const path =require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const  Config =require('./config');

let proFolderName=Config.getProFolderName();
const serviceAddr=Config.getServiceAddr();

module.exports={
    entry:{
        'index': [ './src/'+proFolderName+'/js/index.js' ]
    },
    output: {
        filename: proFolderName+'/js/[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        modules:[path.join(__dirname,'src'),'node_modules'],
        // 默认文件后缀
        extensions: ['*', '.js', '.scss', '.css', '.html','.vue'],
        alias: {
            //确定vue的构建版本
            'vue$':'vue/dist/vue.js',
            '@': path.resolve('src/'+proFolderName),
        },
    },
    module: {
        rules: [
            {
                test:/\.html$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5120,
                        name: 'images/[name].[hash:7].[ext]'
                    }
                }],
            },
            {
                test: /\.(eot|woff|otf|svg|woff2|ttf)([\\?]?.*)$/,
                use: [{
                    loader:'url-loader',
                    options: {
                        name: '[name].[hash:7].[ext]',
                        limit: 5120, // fonts file size <= 5KB, use 'base64'; else, output svg file
                        publicPath: "../../public/fonts/",
                        outputPath: "public/fonts/"
                    }
                }]
            },
            {
                test: /\.vue$/,
                exclude: /(node_modules|bower_components)/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve('src'),
                    path.resolve('/node_modules/element-ui/src'),           //和下面截图文件名字对应起来即可正常打包！！！
                    path.resolve('/node_modules/element-ui/packages')
                ],
                use:{
                    loader: 'babel-loader',
                    options: {
                        "presets": ["@babel/preset-env"]
                    }
                }
            }
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, "../dist"),
        compress: true,
        port: 9000,
        host:Config.getProHost(),
        proxy: {
            '/api/*': {
                target:Config.getServiceAddr(),
                changeOrigin: true
            }
        }
        //index:'index.js.html'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/'+proFolderName+'/index.html',
            filename: proFolderName+'/index.html',
            chunks:['index']
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin()
    ]
};
