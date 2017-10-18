var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssvars      = require('postcss-simple-vars'),
    nested       = require('postcss-nested'),
    cssImport    = require('postcss-import');

gulp.task('styles', function() {
  return gulp.src('./styles/styles.css')
    .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
    .on('error', function(err){
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./public/css'));
});
