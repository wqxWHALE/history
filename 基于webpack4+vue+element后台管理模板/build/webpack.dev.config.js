const merge = require('webpack-merge');
const baseWebpackConfig=require('./webpack.base.config');

let devConfig={
    module: {
        rules:[
            {
                test: /\.css$/,
                use:[
                    {
                        loader:'style-loader'
                    },
                    {
                        loader:'css-loader',
                        options:{
                            sourceMap:false
                        }
                    }
                ]
            }
            // {
            //
            //     test: /\.css$/,
            //
            //     loader: "style-loader!css-loader"
            //
            // },
            //
            // {
            //     test: /\.(eot|woff|otf|svg|woff2|ttf)([\\?]?.*)$/,
            //     loader: "file-loader"
            //
            // }
        ]
    }
};
module.exports=merge(baseWebpackConfig, devConfig);
