// Required Plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const cssnano = require('gulp-cssnano');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');

// Compile Sass
gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// Compile es6 using babel
gulp.task('js', function(){
    return gulp.src('app/js-es6/**/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('app/js/'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// Starts Live Development Server
gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

// Concatenates and minifies multiple JS / CSS dependencies
gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

// Clean directory
gulp.task('clean:dist', function(){
    return del.sync('dist');
})

// Watch for changes in html, js and sass files
gulp.task('watch', ['browserSync', 'sass', 'js'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js-es6/**/*.js', ['js']);
})

// Set default gulp command
gulp.task('default', function(callback){
    runSequence(['sass', 'js', 'browserSync', 'watch'],
        callback
    )
})


// Build
gulp.task('build', function(callback){
    runSequence('clean:dist', ['sass', 'js', 'useref'],
    callback
    )
})
