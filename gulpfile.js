var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var ts = require('gulp-typescript');
var merge = require('merge2');
var log = require('fancy-log');
var paths = {
    pages: ['src/*.html']
};

var tsProject = ts.createProject({
    declaration: true
});

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', gulp.series('copyHtml', function () {
    // build exports for ESNext modules
    var modulesToExport = ['ampm', 'interfaces', 'multitune', 'range', 'spinner', 'timer', 'tune', 'index'];
    modulesToExport.forEach(
        function (fileName) {
            tsifyFile(fileName);
        });

    // build dist directory content
    browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));

    // build dist directory content (uglify)
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulpif('*.js', uglify()))
        .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}));

gulp.task('build', gulp.series('scripts', function () {
    var tsResult = gulp.src('src/*.ts')
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts.pipe(gulp.dest('./')),
        tsResult.js.pipe(gulp.dest('./'))
    ]);
}));

gulp.task('webserver', function () {
    var serve = serveStatic('./', { 'index': ['index.html', 'index.htm'] })

    // Create server
    var server = http.createServer(function onRequest(req, res) {
        serve(req, res, finalhandler(req, res))
    })

    // Listen
    server.listen(3000);
    log('Server is live at http://localhost:3000/');
});

gulp.task('serve', gulp.series('build', 'webserver', function () {

}));

function tsifyFile(fileName) {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/' + fileName + '.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify, { declaration: true })
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source(fileName + '.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src'));

}