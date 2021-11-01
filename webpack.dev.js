const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.s?css$|\.sass$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist'
    },
})