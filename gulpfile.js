// config
var paths = {
  js: ['public/js/*.js'],
  scss: ['source/*.scss']
};

// includes
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var wiredep = require('wiredep').stream;
var autoprefixer = require('gulp-autoprefixer');

// TASKS
gulp.task('bower', function() {
  gulp.src('./public/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./public'));
});

// lint js
gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// compile sass
gulp.task('sass', function () {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/css'));
});

// gulp.task('haml', function () {
//   gulp.src(paths.haml)
//     .pipe(haml({compiler: 'visionmedia'}))
//     .pipe(gulp.dest('./public/views'));
// });

// gulp.task('haml_index', function () {
//   gulp.src(paths.haml_index)
//     .pipe(haml({compiler: 'visionmedia'}))
//     .pipe(gulp.dest('./public'));
// });

// 
gulp.task('watch', ['sass'], function(){
  gulp.watch(paths.js, ['lint']);
  gulp.watch(paths.scss, ['sass']);
});

