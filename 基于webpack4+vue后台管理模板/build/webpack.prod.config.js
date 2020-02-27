const merge = require('webpack-merge');
const config=require('./config');
const baseWebpackConfig=require('./webpack.base.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

let proFolderName=config.getProFolderName();

let proConfig={
    module: {
        rules:[
            {
                test: /\.css$/,
                use:[
                    {
                        loader:MiniCssExtractPlugin.loader
                    },
                    {
                        loader:'css-loader',
                        options:{
                            sourceMap:false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: proFolderName+'/css/[name].[hash].css',
            chunkFilename:'[id].[hash].css'
        })
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
        ]
        // 找到chunk中共享的模块,取出来生成单独的chunk
        // splitChunks: {
        //     chunks: "all",  // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
        //     cacheGroups: {
        //         vendors: {  // 抽离第三方插件
        //             test: /[\\/]node_modules[\\/]/,     // 指定是node_modules下的第三方包
        //             name: "../../public/js/vendors",
        //             priority: -10                       // 抽取优先级
        //         },
        //         // utilCommon: {   // 抽离自定义工具库
        //         //     name: "common",
        //         //     minSize: 0,     // 将引用模块分离成新代码文件的最小体积
        //         //     minChunks: 2,   // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
        //         //     priority: -20
        //         // }
        //     }
        // },
    }
};
module.exports=merge(baseWebpackConfig, proConfig);
