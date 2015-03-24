var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});


var wiredep = require('wiredep').stream;

gulp.task('bower', function () {
  gulp.src('./public/index.html')
    .pipe(wiredep({
      
    }))
    .pipe(gulp.dest('./public'));
});