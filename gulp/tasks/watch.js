var gulp         = require('gulp'),
    watch        = require('gulp-watch'),
    browserSync  = require('browser-sync').create();


gulp.task('watch', function(){

  // initializes browserSync
  // and shows it where the index.html is
  browserSync.init({
    server: {
      notify: false,
      baseDir: "public"
    }
  })

  //Reloads the page  when index.html is changed
  watch('./public/index.html', function(){
    browserSync.reload();
  });

  //Looks for any changes for css files in the modules folder
  // and then runs the cssInject task
  watch('./styles/**/*.css', function(){
    gulp.start('cssInject');
  });

  watch('./public/js/**/*.js', function(){
    gulp.start('scriptsRefresh');
  });

});


// styles is add as a dependency it will run first
// before cssInject runs
gulp.task('cssInject', ['styles'], function(){
  return gulp.src('./public/css/styles.css')
    .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], function(){
  browserSync.reload();
});
