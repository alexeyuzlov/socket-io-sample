const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');

module.exports = function () {
    return {
        entry: './src/scripts/index.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },

        devtool: 'source-map',

        // Currently we need to add '.ts' to the resolve.extensions array.
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.scss$/,
                    loader: 'import-glob-loader',
                    exclude: [
                        /node_modules/
                    ]
                },

                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                },

                {
                    test: /\.(jpg|png|gif)$/,
                    use: `file-loader?name=images/[name].[ext]`
                },

                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            'autoprefixer',
                                        ],
                                    ],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [helpers.root('src', 'styles', 'global')],
                                },
                            },
                        }
                    ],
                    include: [helpers.root('src', 'styles')]
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),

            new CopyPlugin({
                patterns: [
                    {from: 'src/assets', to: 'assets'},
                ],
            }),
        ],

        performance: {
            hints: false
        },
    }
};
