var gulp = require('gulp');
var del = require('del');
var run = require('gulp-run');
var tslint = require("gulp-tslint");
var typescript = require('gulp-tsc');
var browserSync = require('browser-sync').create();
var minify = require('gulp-minify');

gulp.task("tslint", () =>
gulp.src("./app/**/*.ts")
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report({
        emitError: false
    }))
);

gulp.task('clean', function () {
	return del([
	    	    './app/*.js',
	    	    './app/*.map',
	    	    './app/models/*.js',
	    	    './app/models/*.map',
	    	    './app/reducers/*.js',
	    	    './app/reducers/*.map',
	    	    './app/actions/*.js',
	    	    './app/actions/*.map',
	    	    './app/components/**/*.js',
	    	    './app/components/**/*.map',
	    	    './app/services/**/*.js',
	    	    './app/services/**/*.map',
	    	    './testing/**/*.js',
	    	    './testing/**/*.map'
	    	]);
});

var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('tslint:watch', function () {
	gulp.watch('./app/**/*.ts', ['tslint']);
});

gulp.task('compile:watch', function () {
	gulp.watch('./app/**/*.ts', ['compile']);
});

gulp.task('compile', ['tslint:watch', 'sass:watch'], function(){
	  gulp.src(['./app/**/*.ts'])
	    .pipe(typescript({
	        "target": "es5",
	        "module": "commonjs",
	        "moduleResolution": "node",
	        "sourceMap": true,
	        "emitDecoratorMetadata": true,
	        "experimentalDecorators": true,
	        "removeComments": false,
	        "noImplicitAny": true,
	        "suppressImplicitAnyIndexErrors": true,
	        "typeRoots": [
	          "./node_modules/@types/"
	        ]
	      }))
	    .pipe(gulp.dest('app/'))
});

gulp.task('js-watch', function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['browser-sync:watch'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("app/**/*.js", ['js-watch']);
});

gulp.task('browser-sync:watch', ['tslint', 'compile', 'sass', 'compile:watch']);

gulp.task('compress', function() {
	  gulp.src('cms-sfx.js')
	    .pipe(minify({
	        ext:{
	            src:'-debug.js',
	            min:'.js'
	        },
	        exclude: ['tasks']
	    }))
	    .pipe(gulp.dest('./'))
	});
