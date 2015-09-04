var
    gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    postcss         = require('gulp-postcss'),
    autoprefixer    = require('autoprefixer'),
    mqpacker        = require('css-mqpacker'),
    gulpSequence    = require('gulp-sequence'),
    del             = require('del'),
    browserSync     = require('browser-sync'),
    critical        = require('critical').stream;


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
        mqpacker
    ];
    return gulp.src('./css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// Generate & Inline Critical-path CSS/JS
gulp.task('inline', function () {
    return gulp.src('./*.html')
        .pipe(critical({
            base: './build/',
            inline: true,
            minify: true,
            css: ['./build/main.css']
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './',
            index: "Dropshare-LandingPage.html"
        }
    })
});

// CLEAN task (remove folders/files)
gulp.task('clean', function () {
    return del(['./css']);
});

// WATCH task
gulp.task('watch', ['browserSync'], function (){
    gulp.watch('*.scss', ['sass']);
    gulp.watch('css/*.css', ['postcss']);
});

// DEFAULT task
gulp.task('default', ['watch']);
// BUILD task
gulp.task('build', gulpSequence('sass', 'postcss', 'inline'));
