const merge = require('webpack-merge');
const baseWebpackConfig=require('./webpack.base.config');

exports.getProdConfigs=function(entryMap){
    return merge(baseWebpackConfig, {
        mode:"production",
        entry:entryMap
    });
};