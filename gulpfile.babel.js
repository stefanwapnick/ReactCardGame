// gulpfile.babel.js will be processed by babel before running
import gulp from "gulp";
import path from "path";
// Rimraf is npm package used to delete directories
import rimraf from "rimraf";

// This will import all plugins from package.json and put them in plugins variable
const plugins = require("gulp-load-plugins")();

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

gulp.task("default", gulp.series("server:clean", "server:build"));