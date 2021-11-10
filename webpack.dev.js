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
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ]
                                }
                            }
                        }
                    },
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