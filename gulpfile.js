var
    gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    inline          = require('gulp-inline'),
    postcss         = require('gulp-postcss'),
    autoprefixer    = require('autoprefixer'),
    mqpacker        = require('css-mqpacker'),
    csswring        = require('csswring'),
    gulpSequence    = require('gulp-sequence'),
    del             = require('del'),
    browserSync     = require('browser-sync');


//////////////////////////////////////////////////
///////// TASKS
//////////////////////////////////////////////////

gulp.task('sass', function () {
  return gulp.src('./*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('postcss', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 version']}),
        mqpacker,
        csswring
    ];
    return gulp.src('./css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./prod/css/'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

gulp.task('inline', function () {
    return gulp.src('./*.html')
      .pipe(inline({
        // base: './',
        disabledTypes: ['svg', 'img', 'js']
      }))
      .pipe(gulp.dest('./'));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './',
      index: "Dropshare-LandingPage.html"
    },
  })
})

gulp.task('clean', function () {
    return del(['./css']);
})

gulp.task('query', gulpSequence('sass', 'postcss', 'clean'));
gulp.task('query2', gulpSequence('sass', 'postcss', 'inline', 'clean'));
// watch task
gulp.task('watch', ['browserSync'], function (){
    gulp.watch('*.scss', ['sass']);
    gulp.watch('./css/*.css', ['postcss']);
})
// DEFAULT task
gulp.task('default', ['watch']);
