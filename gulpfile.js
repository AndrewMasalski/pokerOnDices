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

var injectFiles = {
    bowerCss: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/angular-xeditable/dist/css/xeditable.css',
        'bower_components/ngActivityIndicator/css/ngActivityIndicator.min.css'
    ],
    bowerJs: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/firebase/firebase.js',
        'bower_components/angular/angular.js',
        'bower_components/angularfire/dist/angularfire.min.js',
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
    all: function () {
        return this.bowerCss.concat(this.bowerJs);
    }
};

// tasks
gulp.task('lint', function () {
    gulp.src(['./app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function () {
    gulp.src('./dist/*')
        .pipe(clean({force: true}));
});
gulp.task('minify-css', function () {
    var opts = {comments: true, spare: true};
    gulp.src(['./app/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(minifyCSS(opts))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-html-files', function () {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});
gulp.task('copy-bower-files', function () {
    var bowerSources = injectFiles.all();
    bowerSources.push('bower_components/bootstrap/dist/fonts/**');
    gulp.src(bowerSources, {base: './'})
        .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function () {
    gulp.src(['./app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify({
            //inSourceMap:
            //outSourceMap: "app.js.map"
        }))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./dist/'))
});
gulp.task('inject', ['copy-html-files', 'copy-bower-files', 'minify-css', 'minify-js'], function () {
    var target = gulp.src('./dist/index.html');
    var bowerSources = injectFiles.all();
    var appSources = ['dist/app.min.css', 'dist/app.min.js'];
    var allSources = bowerSources.concat(appSources);
    var sources = gulp.src(allSources);
    return target
        .pipe(inject(sources, {ignorePath: 'dist/'}))
        .pipe(gulp.dest('./dist/'));
});
gulp.task('serve', function () {
    connect.server({
        root: 'dist/',
        port: 8000
    });
});

// default task
gulp.task('default',
    ['build', 'serve']
);
// build task
gulp.task('build',
    ['lint', 'inject']
);