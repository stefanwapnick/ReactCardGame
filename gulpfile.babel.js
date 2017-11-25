// gulpfile.babel.js will be processed by babel before running
import gulp from "gulp";
import path from "path";
import child_process from "child_process";
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

gulp.task("server:clean", function(callback){
    rimraf("./build", () => callback());
});

gulp.task("server:test", gulp.series("server:build", runTests));

gulp.task("server:cleanbuild", gulp.series("server:clean", "server:build"));

gulp.task("server:watch", gulp.series("server:clean","server:build", buildOnFileChanges));

// Whenever the build folder changes, nodemon will re-run server.js file
gulp.task("server:dev", gulp.series("server:cleanbuild", gulp.parallel(buildOnFileChanges, runServerOnChange)));

gulp.task("server:dev:test", gulp.series("server:cleanbuild", gulp.parallel(buildOnFileChanges, runTestsOnChange)));