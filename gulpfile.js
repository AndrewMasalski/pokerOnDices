// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

var injectFiles = {
    bowerCss: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/angular-xeditable/dist/css/xeditable.css',
        'bower_components/ngActivityIndicator/css/ngActivityIndicator.min.css'
    ],
    bowerJs: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/firebase/firebase.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-bindonce/bindonce.min.js',
        'bower_components/angularfire/dist/angularfire.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-xeditable/dist/js/xeditable.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/angular-base64/angular-base64.js',
        'bower_components/ngActivityIndicator/ngActivityIndicator.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
        'bower_components/lodash/lodash.min.js'
    ],
    misc: [
        'bower_components/bootstrap/dist/fonts/**'
    ],
    all: function () {
        return this.bowerCss.concat(this.bowerJs);
    }
};

// tasks
gulp.task('lint', function () {
    return gulp.src(['./app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function () {
    return gulp.src('dist/*')
        .pipe(clean({force: true}));
});
gulp.task('minify-css', function () {
    var opts = {comments: true, spare: true};
    return gulp.src(['app/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(minifyCSS(opts))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('dist/'))
});
gulp.task('copy-html-files', function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist/'));
});
gulp.task('copy-bower-files', function () {
    var bowerSources = injectFiles.all();
    bowerSources.push('bower_components/bootstrap/dist/fonts/**');
    return gulp.src(bowerSources, {base: './'})
        .pipe(gulp.dest('dist/'))
});
gulp.task('minify-js', function () {
    return gulp.src(['./app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify({
            //inSourceMap:
            //outSourceMap: "app.js.map"
        }))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist/'))
});
gulp.task('copy-dev-js', function () {
    return gulp.src(['app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/'))
});
gulp.task('copy-dev-css', function () {
    return gulp.src(['app/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('dist/'))
});
gulp.task('inject-dev', function () {
    var target = gulp.src('dist/index.html');
    var bowerSources = injectFiles.all();
    var appSources = ['dist/app.css', 'dist/app.js'];
    var allSources = bowerSources.concat(appSources);
    var sources = gulp.src(allSources);
    return target
        .pipe(inject(sources, {ignorePath: 'dist/'}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('inject-prod', function () {
    var target = gulp.src('dist/index.html');
    var bowerSources = injectFiles.all();
    var appSources = ['dist/app.min.css', 'dist/app.min.js'];
    var allSources = bowerSources.concat(appSources);
    var sources = gulp.src(allSources);
    return target
        .pipe(inject(sources, {ignorePath: 'dist/'}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('serve', function () {
    return connect.server({
        root: 'dist/',
        port: 8000
    });
});

// default task
gulp.task('default', ['serve']);

// copy files
gulp.task('common', ['lint', 'copy-html-files', 'copy-bower-files']);

// build-dev task
gulp.task('build-dev', ['clean'], function (cb) {
    runSequence(
        ['common', 'copy-dev-css', 'copy-dev-js'],
        'inject-dev',
        cb
    );
});

// build-prod task
gulp.task('build-prod', function (cb) {
    runSequence(
        ['common', 'minify-css', 'minify-js'],
        'inject-prod',
        cb
    );
});