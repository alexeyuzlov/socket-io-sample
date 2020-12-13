const nodeExternals = require('webpack-node-externals');
const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    target: 'node',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new NodemonPlugin({
            script: './dist/bundle.js',

            watch: path.resolve('./dist'),

            ignore: ['*.js.map'],

            ext: 'js,json',

            delay: "1000",

            verbose: true,
        })
    ],
    devtool: 'source-map'
};
