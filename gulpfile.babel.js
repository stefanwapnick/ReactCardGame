// gulpfile.babel.js will be processed by babel before running
import gulp from "gulp";
import path from "path";
import child_process from "child_process";
import webpackConfig from "./webpack.config";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

// Rimraf is npm package used to delete directories
import rimraf from "rimraf";



// This will import all plugins from package.json and put them in plugins variable
const plugins = require("gulp-load-plugins")();

// Trigger a new build whenever any of the source files changes
function buildOnFileChanges(){
    return gulp.watch("./src/server/**/*.js", gulp.series("server:build"))
        // Just eat the error so gulp watch doesn't crash
        .on("error", function(){});
}

// Nodemon will run node <script> whenever watched directory changes
function runServerOnChange() {
    return plugins.nodemon({
        script: "./server.js",
        watch: "build",
        ignore: "**/tests"
    });
}

// Run test files
function runTests(callback){
    child_process.exec("node ./tests.js", (error, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if(error){
            callback(new plugins.util.PluginError("runTests", "Tests failed."));
        }else{
            callback();
        }
    });
}

// Nodemon will run node <script> whenever watched directory changes
function runTestsOnChange() {
    return plugins.nodemon({
        script: "./tests.js",
        watch: "build"
    });
}

gulp.task("server:build", function(){
    return gulp.src("./src/server/**/*.js")
        .pipe(plugins.changed("./build"))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel())
        // Tell sourcemaps where our source files exist
        .pipe(plugins.sourcemaps.write(".", {sourceRoot: path.join(__dirname, "src", "server")}))
        .pipe(gulp.dest("./build"));
});

// Clean server build directory
gulp.task("server:clean", function(callback){
    rimraf("./build", () => callback());
});

// Test server code
gulp.task("server:test", gulp.series("server:build", runTests));

// Clean and build
gulp.task("server:cleanbuild", gulp.series("server:clean", "server:build"));

// Watch server files for changes, build on change
gulp.task("server:watch", gulp.series("server:clean","server:build", buildOnFileChanges));

// Whenever the build folder changes, nodemon will re-run server.js file
gulp.task("server:dev", gulp.series("server:cleanbuild", gulp.parallel(buildOnFileChanges, runServerOnChange)));

// Whenver files change, re-run tests
gulp.task("server:dev:test", gulp.series("server:cleanbuild", gulp.parallel(buildOnFileChanges, runTestsOnChange)));


// ----------------------------------------------
// CLIENT BUILD TASKS
// ----------------------------------------------------
const consoleStats = {
    colors: true,
    exclude: ["node_modules"],
    chunks: true,
    assets: false,
    timings: true,
    modules: false,
    hash: false,
    version: false
};


function buildClient(callback){
    webpack(webpackConfig, function(error, stats){
        if(error){
            callback(error);
            return;
        }

        console.log(stats.toString(consoleStats));
        callback();
    });
}

function watchClient() {
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, {
        publicPath: "/build/",
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        stats: consoleStats,
        watchOptions: { aggregateTimeout: 300, poll: 500 }
    });

    server.listen(8080, function(){});
}

gulp.task("client:clean", function(callback){
    rimraf("./public/build", function(){
        callback();
    });
});
gulp.task("client:build", gulp.series("client:clean", buildClient));
gulp.task("client:dev", gulp.series("client:clean", watchClient));


// ----------------------------------------------------
// GENERAL RUN TASKS
// ----------------------------------------------------
gulp.task("dev", gulp.parallel("server:dev", "client:dev"));
gulp.task("build", gulp.parallel("server:build", "client:build"));