/**
 * require gulp
 */
var gulp = require('gulp');

/**
 * gulp-sass
 * Compile all *.scss files.
 */
var sass = require('gulp-sass');
gulp.task('sass', function () {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(sass(
            { outputStyle: 'expanded' }
        ))
        .pipe(gulp.dest('dev/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/**
 * gulp-autoprefixer
 * Add all necessary browse prefix.
 */
var autoprefixer = require('gulp-autoprefixer');
gulp.task('prefixer', function() {
    gulp.src('dev/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
});

/**
 * gulp-useref
 * gulp-uglify
 * gulp-cssnano
 * Concatenete and minify all js and css files.
 */
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
gulp.task('useref', function () {
    return gulp.src('dev/*.html')
        .pipe(useref())

        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))

        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

/**
 * gulp-imagemin
 * Optimize all project images.
 */
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
gulp.task('imgOptimize', function () {
    return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

/**
 * fonts
 * Transfer fonts folder from dev to dist.
 */
gulp.task('fonts', function () {
    return gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

/**
 * del
 * Clean up generated files automatically.
 */
var del = require('del');
gulp.task('clean:dist', function () {
    return del.sync('dist');
});

/**
 * Clear all caches.
 */
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})

/**
 * browser-sync
 * Refresh the browser when save a html/scss/js file.
 */
var browserSync = require('browser-sync').create();
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dev'
        },
    })
});

/**
 * watch
 * Watch all file changes and run all necessary actions.
 */
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('dev/scss/**/*.scss', ['sass']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dev/*.html', browserSync.reload);
    gulp.watch('dev/js/**/*.js', browserSync.reload);
});

/**
 * run-sequence
 * Run the right sequence of tasks.
 */
var runSequence = require('run-sequence');
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'imgOptimize', 'fonts'],
        callback
    )
});
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})
