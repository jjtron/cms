var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*']
});

gulp.task('default', function () {
  plugins.nodemon({ script: './bin/www', ext: 'js'});
});
