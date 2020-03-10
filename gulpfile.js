/**
 * Description: Configs Gulp for project
 * Company: HTV
 * Author: TuanNA
 * Date: 01/09/2019
 */
const del          = require('del');
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const cache        = require('gulp-cache');
const gulpIf       = require('gulp-if');
const useref       = require('gulp-useref');
const uglify       = require('gulp-uglify-es').default;
const cssnano      = require('gulp-cssnano');
const imagemin     = require('gulp-imagemin');
const browserSync  = require('browser-sync');
const runSequence  = require('run-sequence');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude  = require('gulp-file-include');
const spritesmith  = require("gulp.spritesmith");

const path = {
    src             : 'src',
    dist            : 'dist',
    srcCss          : 'src/css',
    distFonts       : 'dist/fonts',
    srcFont         : 'src/fonts',
    srcFonts        : 'src/fonts/**',
    srcImg          : 'src/images',
    srcImgFile      : 'src/images/**/**/*.+(png|jpg|jpeg|gif|svg)',
    distImgs        : 'dist/images',
    srcJs           : 'src/js',
    srcJsFile       : 'src/js/**/*.js',
    srcSass         : 'src/scss',
    srcSassFile     : 'src/scss/**/*.scss',
    srcHtmlFile     : 'src/*.html',
    srcHtmlViewFile : 'src/views/*.html',
    srcHtmlView     : 'src/views/**/*',
    srcLibs         : 'src/libs/*/**',
    distLibs        : 'dist/libs'
}
// -----------------------------------
// Development Tasks
// ----------------------------------
gulp.task('browserSync', function () {
    browserSync({
        server: { baseDir: path.src }
    });
})

gulp.task('sass', function () {
    return gulp.src(path.srcSassFile)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.srcCss))
        .pipe(browserSync.reload({
            stream: true
        }));
})

gulp.task('watch', function () {
    gulp.watch(path.srcSassFile, ['sass']);
    gulp.watch(path.srcJsFile, browserSync.reload);
    gulp.watch(path.srcHtmlViewFile, ['sources']);
    gulp.watch(path.srcHtmlView, ['sources']);
    gulp.watch(path.srcHtmlFile, browserSync.reload);
    gulp.watch(path.srcImgFile, browserSync.reload);
})

gulp.task('sources', function () {
    return gulp.src(path.srcHtmlViewFile)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.src));
});

// -----------------------------------
// Optimization Tasks
// -----------------------------------

gulp.task('useref', function () {
    return gulp.src(path.srcHtmlFile)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', autoprefixer({
            browsers: ['last 15 versions'],
            cascade: true
        })))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest(path.dist));
});

gulp.task('images', function () {
    return gulp.src(path.srcImgFile)
        .pipe(cache(imagemin({ interlaced: true })))
        .pipe(gulp.dest(path.distImgs))
});

gulp.task('fonts', function () {
    return gulp.src(path.srcFonts)
        .pipe(gulp.dest(path.distFonts))
});

gulp.task( 'libs', function() {
    return gulp.src(path.srcLibs)
        .pipe( gulp.dest(path.distLibs));
});

gulp.task('clean:cache', function (cb) {
    return cache.clearAll(cb);
});

gulp.task('clean:dist', function () {
    return del.sync(['dist']);
});

// -----------------------------------
// Build Sequences
// --------------------------------
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'sources'], 'watch',
        callback
    )
})

gulp.task('build', function (callback) {
    runSequence(
        'clean:cache',
        'clean:dist',
        'sass',
        ['sources', 'useref', 'images', 'fonts', 'libs'],
        callback
    )
})