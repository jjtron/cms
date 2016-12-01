var gulp = require('gulp');
var del = require('del');
var run = require('gulp-run');
var tslint = require("gulp-tslint");
var typescript = require('gulp-tsc');

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

gulp.task('default', ['tslint', 'compile', 'sass', 'compile:watch'])
