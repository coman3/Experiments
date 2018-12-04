// ### Node Libaries ###
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

// ### Webpack Plugins ###
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// ### Local Scripts ###
const gitInfo = require("./scripts/gitInfo")();

// ### Shared Build Config ###
const mainModules = [
    'core-js',
    'whatwg-fetch',
    'react-hot-loader/patch',
    './src/index.tsx'
];
const vendor = require('./webpack.config.shared').makeVendorEntry({
    mainModules,
    modulesToExclude: ["express"]
});

function srcPath(subdir) {
    return path.join(__dirname, "src", subdir);
}

module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    devtool: 'source-map',
    devServer: {
        port: 3000,
        clientLogLevel: 'warning',
        open: true,
        hot: true,
        historyApiFallback: true,
        stats: 'errors-only',
    },
    entry: {
        main: mainModules,
        vendor: vendor
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerNotifierWebpackPlugin({
            title: 'TypeScript',
            excludeWarnings: false
        }),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            watch: ['./src'] // optional but improves performance (fewer stat calls)
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.VERSION': JSON.stringify(gitInfo.commitHash.toString() + " " + gitInfo.branch.toString())
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        }),
    ],
    module: {
        rules: [{
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            },
            // Sass files (Hot Reload Supported)
            {
                test: /\.scss$|\.css$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            camelCase: true,
                            importLoaders: 2,
                            minimize: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: "sass-loader?sourceMap"
                    }
                ]
            },
            // Typescript files (Hot Reload Supported)
            {
                test: /.tsx?$/,
                use: [{
                        loader: 'react-hot-loader/webpack'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            silent: true
                        }
                    }
                ],
                exclude: path.resolve(process.cwd(), 'node_modules'),
                include: path.resolve(process.cwd(), 'src'),
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        // Allows for nonrelative imports eg: `import { HomePage } from 'pages';`
        // instead of `import { HomePage } from "../[∞]/../pages";` etc ;)
        // Also make sure you add these to the production webpack config, and the tsconfig:paths section
        alias: {
            pages: srcPath("pages"),
            components: srcPath("components"),
            components: srcPath("containers"),
            components: srcPath("models"),
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: "/",
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },


};