const merge = require('webpack-merge');
const baseWebpackConfig=require('./webpack.base.config');


exports.getDevConfigs=function(entryMap) {
    return merge(baseWebpackConfig, {
        mode:"development",
        entry:entryMap
    });
};
