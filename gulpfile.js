import gulp from 'gulp';
import concat from 'gulp-concat';
import htmlMin from 'gulp-htmlmin';
import sass from 'gulp-dart-sass';
import autoprefixes from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import svgSprite from 'gulp-svg-sprite';
import image from 'gulp-image';

import gulpUglify from 'gulp-uglify-es';
const uglify = gulpUglify.default;
import babel from 'gulp-babel';
import notify from 'gulp-notify';

import sourcemaps from 'gulp-sourcemaps';
import { deleteAsync } from 'del';
import gulpIf from 'gulp-if';

let prod = false;

const isProd = (done) => {
  prod = true;
  done();
}

// ------------- //

import browserWatch from 'browser-sync';
const browserSync = browserWatch.create();

// --- tasks --- //

gulp.task('clean', async () => {
  return await deleteAsync(['dist']);
});

gulp.task('htmlMinify', () => {
  return gulp.src('src/**/*.html')
    .pipe(gulpIf(prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Только переносит шрифты из src в dst
gulp.task('fonts', () => {
  return gulp.src('src/fonts/*.*', {encoding: false})
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

// Работа с scss файлами
gulp.task('styles_scss', () => {
  return gulp.src('src/styles/scss/style.scss')
    .pipe(gulpIf(!prod, sourcemaps.init()))
      .pipe(sass({
        outputStyle: 'expanded',
        silenceDeprecations: ['legacy-js-api', 'import'],
      }).on('error', sass.logError))
      .pipe(autoprefixes({
        cascade: false,
      }))
      .pipe(gulpIf(prod, cleanCSS({
        level: 2,
      })))
    .pipe(gulpIf(!prod, sourcemaps.write()))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
})

// css файлы - добавление prefix и минификация
gulp.task('styles_css', () => {
  return gulp.src('src/styles/css/**/*.css')
      .pipe(autoprefixes({
        cascade: false,
      }))
      .pipe(gulpIf(prod, cleanCSS({
        level: 2,
      })))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// css файлы - только минификация
gulp.task('styles_css_min', () => {
  return gulp.src('src/styles/css_min/**/*.css')
      .pipe(gulpIf(prod, cleanCSS({
        level: 2,
      })))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('svgSprites', () => {
  return gulp.src('src/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
            dest : '.',
            sprite: 'sprite.svg',
        },
    }
    }))
    .pipe(gulp.dest('dist/svg'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/*.svg',
    'src/img/**/*.jpeg'
    ], {encoding: false})
    .pipe(image())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src([
    'src/js/components/**/*.js',
    'src/js/main.js'
    ])
    .pipe(gulpIf(!prod, sourcemaps.init()))
      .pipe(gulpIf(prod, babel({
        presets: ['@babel/env'],
      })))
      .pipe(concat('app.js'))
      .pipe(gulpIf(prod, uglify().on('error', notify.onError())))
    .pipe(gulpIf(!prod, sourcemaps.write()))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('resources', () => {
  return gulp.src('src/resources/**', {encoding: false})
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// --- watch --- //

gulp.task('server', () => {
  browserSync.init({
      server: {
          baseDir: 'dist'
      },
      // open: false,
      browser: "chrome",
  });

  gulp.watch('src/**/*.html', gulp.parallel('htmlMinify'));
  gulp.watch('src/fonts/*.*', gulp.parallel('fonts'));
  gulp.watch('src/styles/scss/**/*.scss', gulp.parallel('styles_scss'));
  gulp.watch('src/styles/css/**/*.css', gulp.parallel('styles_css'));
  gulp.watch('src/styles/css_min/**/*.css', gulp.parallel('styles_css_min'));
  gulp.watch('src/svg/**/*.svg', gulp.parallel('svgSprites'));
  gulp.watch([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/*.svg',
    'src/img/**/*.jpeg'], gulp.parallel('images'));
  gulp.watch('src/js/**/*.js', gulp.parallel('scripts'));
  gulp.watch('src/resources/**', gulp.parallel('resources'));

});

// ------------- //

gulp.task('dev', gulp.series('clean', 'htmlMinify', 'fonts', 'styles_scss', 'styles_css', 'styles_css_min', 'images', 'svgSprites', 'scripts', 'resources', 'server'));

gulp.task('build', gulp.series(isProd, 'clean', 'htmlMinify', 'fonts', 'styles_scss', 'styles_css', 'styles_css_min', 'images', 'svgSprites', 'scripts', 'resources'));
