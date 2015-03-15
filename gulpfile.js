'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  // jade = require('gulp-jade'),
  include = require('gulp-include'),
  // templateCache = require('gulp-angular-templatecache'),
  cssImport = require("gulp-cssimport"),

  // sassDir = './assets/sass/*.sass',
  // jadeDir = './app/**/*.jade',
  appRoot = './public/js/**/*.js',
  jsDest = './public/bundles'
  // cssDest = './../app/assets/stylesheets/bundles',
  // fontDest = './../app/assets/fonts'
  ;

// gulp.task('templates', function() {
//   return gulp.src(jadeDir)
//     .pipe(jade({
//       pretty: true,
//       doctype: 'html'
//     }))
//     .pipe(templateCache({
//       module: 'zpice.templates',
//       standalone: true
//     }))
//     .pipe(gulp.dest(jsDest));
// });

gulp.task("scripts", function() {
  return gulp.src('./public/js/*.js')
    .pipe(include({
      extensions: 'js'
    }))
    .pipe(gulp.dest(jsDest));
});

// gulp.task('styles', function () {
//   return gulp.src(sassDir)
//     .pipe(sass({
//       errLogToConsole: true,
//       indentedSyntax : true
//     }))
//     .pipe(cssImport({}))
//     .pipe(gulp.dest(cssDest));
// });

// gulp.task('fonts', function() {
//   return gulp.src("./bower_components/bootstrap-sass-official/assets/fonts/**/*")
//     .pipe(gulp.dest(fontDest));
// });

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['scripts']);//['templates', 'scripts', 'styles', 'fonts']);
gulp.task('watch', function() {
  // gulp.watch(jadeDir, ['templates']);
  gulp.watch(appRoot, ['scripts']);
  // gulp.watch(sassDir, ['styles', 'fonts']);
});
