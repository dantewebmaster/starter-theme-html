var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

/**
 * Error and success notifications.
 */
// Error Message
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var plumberErrorHandler = {
    errorHandler: notify.onError({
        title: 'Gulp Error! :(',
        sound: false,
        message: '<%= error.message %>'
    })
};
// Success Message
var onSuccessMessage = {
    title: function () {
        return 'Gulp Success! :)';
    },
    onLast: true,
    sound: false,
    message: "Successfully compiled to: <%= file.relative %>"
};

/**
 * Development Tasks
 */ 

// Start browserSync server
gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'dev'
        }
    })
})

gulp.task('sass', function () {
    return gulp.src('dev/scss/**/*.scss') // Gets all files ending with .scss in dev/scss and children dirs
        .pipe(plumber(plumberErrorHandler))
        .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(notify(onSuccessMessage))  
        .pipe(gulp.dest('dev/css')) // Outputs it in the css folder
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }));
})

// Watchers
gulp.task('watch', function () {
    gulp.watch('dev/scss/**/*.scss', ['sass']);
    gulp.watch('dev/*.html', browserSync.reload);
    gulp.watch('dev/js/**/*.js', browserSync.reload);
})

/**
 * Optimization Tasks
 */  

// Optimizing CSS and JavaScript 
gulp.task('useref', function () {

    return gulp.src('dev/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.html', htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function () {
    return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true,
        })))
        .pipe(gulp.dest('dist/images'))
});

// Copying fonts 
gulp.task('fonts', function () {
    return gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

// Cleaning 
gulp.task('clean', function () {
    return del.sync('dist').then(function (cb) {
        return cache.clearAll(cb);
    });
})

gulp.task('clean:dist', function () {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

/**
 * Build Sequences
 */

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync'], 'watch',
        callback
    )
})

gulp.task('build', function (callback) {
    runSequence(
        'clean:dist',
        'sass',
        ['useref', 'images', 'fonts'],
        callback
    )
})
