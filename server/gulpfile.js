const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const liveReload = require('gulp-livereload');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');

const ROOTPATHS = {
  static: './static/',
  dest: './static/dist/',
};

const DIRNAMES = {
  styles: 'styles',
  scripts: 'scripts',
  images: 'images',
  fonts: 'fonts',
  dist: 'dist',
};

const RESOURCES = {
  [DIRNAMES.styles]: ROOTPATHS.static + DIRNAMES.styles,
  [DIRNAMES.scripts]: ROOTPATHS.static + DIRNAMES.scripts,
  [DIRNAMES.images]: ROOTPATHS.static + DIRNAMES.images,
  [DIRNAMES.fonts]: ROOTPATHS.static + DIRNAMES.fonts,

};

const DISTPATHS = {
  [DIRNAMES.styles]: ROOTPATHS.dest + [DIRNAMES.styles],
  [DIRNAMES.scripts]: ROOTPATHS.dest + [DIRNAMES.scripts],
  [DIRNAMES.images]: ROOTPATHS.dest + [DIRNAMES.images],
  [DIRNAMES.fonts]: ROOTPATHS.dest + [DIRNAMES.fonts],
};

gulp.task('transpile', () => {
  gulp.src(`${RESOURCES.scripts}/**/**.js`)
        .pipe(babel({
          presets: 'es2015',
        }))
        .pipe(gulp.dest(DISTPATHS.scripts))
        .pipe(liveReload());
});
gulp.task('sass', () => gulp.src(`${RESOURCES.styles}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DISTPATHS.scripts)));
gulp.task('watch', () => {
  liveReload.listen();
  gulp.watch(RESOURCES.scripts, ['js']);
});
gulp.task('js', () => {
  gulp.src(`${RESOURCES.scripts}/**/**.js`)
        .pipe(sourceMaps.init())
        .pipe(babel({
          presets: 'es2015',
        }))
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(DISTPATHS.scripts))
        .pipe(liveReload());
});
