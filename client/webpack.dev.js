const {merge} = require('webpack-merge');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

module.exports = function () {
    return merge(commonConfig(), {
        mode: 'development',

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js'
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'tslint-loader',
                            options: {
                                configFile: helpers.root('tslint.json')
                            }
                        }
                    ],
                    include: [helpers.root('src')]
                },
            ]
        },
        devServer: {
            static: {
                directory: helpers.root('src/'),
            },
            open: true,
            proxy: {
                // [`${configLib.PROXY_PATH}**`]: {
                //     target: METADATA.API_URL,
                //     secure: false,
                //     changeOrigin: true,
                //     pathRewrite: {
                //         [`^${configLib.PROXY_PATH}`]: ''
                //     }
                // }
            },
            port: 7375,
            historyApiFallback: true
        },
    });
};
