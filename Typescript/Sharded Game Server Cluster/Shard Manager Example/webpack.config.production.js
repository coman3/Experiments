// ### Node Libaries ###
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const glob = require('glob-all')

// ### Webpack Plugins ###
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// ### Local Scripts ###
const gitInfo = require("./scripts/gitInfo")();



// ### Shared Build Config Preperation ###
const mainModules = [
    'core-js',
    'whatwg-fetch',
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
    entry: {
        main: mainModules,
        vendor: vendor
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new SimpleProgressWebpackPlugin({
            format: "expanded"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            memoryLimit: 4096,
            checkSyntacticErrors: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.VERSION': JSON.stringify(gitInfo.commitHash)
        }),
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            inject: true,
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new PurgecssPlugin({
            paths: glob.sync("./src/**/*", {
                nodir: true
            })
        }),
        new StyleExtHtmlWebpackPlugin({
            minify: true
        }),
    ],
    module: {
        rules: [
            // Miscellaneous files, such as fonts, images or audio files
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            },
            // Typescript files
            {
                test: /.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }],
                exclude: path.resolve(process.cwd(), 'node_modules'),
                include: path.resolve(process.cwd(), 'src'),
            },
            // Sass files
            {
                test: /\.scss$|\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
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
                })
            },

        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        // Allows for nonrelative imports eg: `import { HomePage } from 'pages';`
        // instead of `import { HomePage } from "../[∞]/../pages";` etc ;)
        // Also make sure you add these to the development webpack config, and the tsconfig:paths section
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
        publicPath: "/"
    },
};