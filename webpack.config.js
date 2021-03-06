const path = require("path");
const _ = require("lodash");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// List of npm packages to be included in vendor.bundle.js
const vendor = [
    "lodash",
    "react",
    "react-dom",
    "react-router",
    "socket.io-client",
    "rxjs"
];

function createConfig(isDebug){

    const devtool = isDebug ? "eval-source-map" : null;

    const plugins = [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        // Define global variables
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: `"${process.env.NODE_ENV || "development"}"`
            },
            IS_PRODUCTION: !isDebug,
            IS_DEVELOPMENT: isDebug
        })
    ];

    // Configure loaders for webpack. Whenever you write import {stuff} from "file.ext"
    // the test property of each loader will be run against the file to choose the right loader to use
    const loaders = {
        // Regex will match .js or jsx
        js: {test: /\.jsx?$/, loader: "babel", exclude: /node_modules/},
        eslint: {test: /\.jsx?$/, loader: "eslint", exclude: /node_modules/},
        json: {test: /\.json$/, loader: "json"},
        css: {test: /\.css$/, loader: "style!css?sourceMap"},
        sass: {test: /\.scss$/, loader: "style!css?sourceMap!sass?sourceMap"},
        files: {test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=5000" }
    };

    const clientEntry = ["babel-polyfill", "./src/client/client.js"];
    let publicPath = "/build/";

    if(isDebug){
        //Configure hot-reloading, but for development only
        plugins.push(new webpack.HotModuleReplacementPlugin());
        clientEntry.unshift(
            "react-hot-loader/patch",
            "webpack-dev-server/client?http://localhost:8080/",
            "webpack/hot/only-dev-server");

        publicPath = "http://localhost:8080/build/";
    }else{
        // In non-debug version, we will extract all style imports into a seperate file using the ExtractTextPlugin
        plugins.push(
            // Remove duplicate modules
            new webpack.optimize.DedupePlugin(),
            // Extract styles into a seperate css file
            new ExtractTextPlugin("[name].css"),
            // Minify code
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));

        // Replace css and sass loader with extract text plugin
        // This will cause normal loading processing of css and sass to be handled by extract text plugin
        // Normal behavior of css and sass loader is to inline styles in bundle file, but in production we want separate file
        loaders.css.loader = ExtractTextPlugin.extract("style", "css");
        loaders.sass.loader = ExtractTextPlugin.extract("style", "css!sass");
    }

    return {
        name: "client",
        devtool: devtool,
        entry: {
            app: clientEntry,
            vendor: vendor
        },
        output: {
            path: path.join(__dirname, "public", "build"),
            filename: "[name].js",
            publicPath : publicPath
        },
        resolve: {
            extensions: ["", ".js", ".jsx"],
            alias: {
                shared: path.join(__dirname, "src", "server", "shared")
            }
        },
        module: {
            loaders: _.values(loaders)
        },
        plugins: plugins
    };
}

module.exports = createConfig(process.env.NODE_ENV !== "production");
module.exports.create = createConfig;