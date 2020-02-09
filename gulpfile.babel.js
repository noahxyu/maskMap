import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
import pump from 'pump';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';

const paths = {
  html: {
    src : './src/*.html',
    dest: './dist',
  },
  styles: {
    src: './src/styles/**/*.scss',
    dest: './dist/css/',
    task: './dist/css/*.css'
  },
  js: {
    src: './src/js/*.js',
    dest: './dist/js',
    task: './dist/js/**/*.js'
  }
}



//browserSync
function browserSyncSetting() {
  browserSync.init({
    port:'61620',
    server:{
      baseDir:'./dist'
    }
  });
}


// 每次編譯前先移除原有檔案
function clean() {
  return del([ 'dist' ]);
}



function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// style
function styles() {
  return gulp
      .src(paths.styles.src)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([autoprefixer]))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(browserSync.stream())
}


function js() {
  return gulp
    .src(paths.js.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// watch
function watchFiles() {
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.js.src, js)
}

//
function minifyCss() {
  return gulp
    .src(paths.styles.task)
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest));
}

function uglifyJs(cb){
  pump([
      gulp.src(paths.js.task),
      uglify(),
      gulp.dest(paths.js.dest)
    ], cb
  );
}


const watch = gulp.parallel(watchFiles, browserSyncSetting);
const build = gulp.series(minifyCss, uglifyJs);

exports.styles = styles;
exports.watch = watch;
exports.default = build;

