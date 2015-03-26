var paths = {
  js: ['public/js/*.js'],
  scss: ['source/*.scss']
};

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var wiredep = require('wiredep').stream;

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

gulp.task('sass', function () {
  gulp.src('./source/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function(){
  gulp.watch(paths.js, ['lint']);
  gulp.watch(paths.scss, ['sass']);
});

