var gulp = require('gulp');
var del = require('del');
var run = require('gulp-run');
var tslint = require("gulp-tslint");

gulp.task("tslint", () =>
gulp.src("./app/**/*.ts")
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report({
        emitError: false
    }))
);

gulp.task('tsc', ['tslint'], function() {
	return run('npm run tsc').exec();
});

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

