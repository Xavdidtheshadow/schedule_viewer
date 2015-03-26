var paths = {
  js: ['public/js/*.js']
};

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var wiredep = require('wiredep').stream;

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('bower', function () {
  gulp.src('./public/index.html')
    .pipe(wiredep({
      
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function(){
  gulp.watch(paths.js, ['lint']);
});