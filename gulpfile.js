'use strict'

const { execFile } = require('child_process')
const gulp = require('gulp')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const svg2png = require('gulp-svg2png')
const toIco = require('gulp-to-ico')

gulp.task('icons', ['macos-icon', 'windows-icon'])

gulp.task('iconset', function() {
  return merge(
    generateIcon('icon_16x16.png', 16),
    generateIcon('icon_16x16@2x.png', 32),
    generateIcon('icon_32x32.png', 32),
    generateIcon('icon_32x32@2x.png', 64),
    generateIcon('icon_128x128.png', 128),
    generateIcon('icon_128x128@2x.png', 256),
    generateIcon('icon_256x256.png', 256),
    generateIcon('icon_256x256@2x.png', 512),
    generateIcon('icon_512x512.png', 512),
    generateIcon('icon_512x512@2x.png', 1024)
  )
})

gulp.task('macos-icon', ['iconset'], function(cb) {
  if (process.platform == 'darwin')
    execFile('iconutil', [
      '-c',
      'icns',
      '-o',
      'build/icon.icns',
      'build/icon.iconset'
    ], cb)
  else
    cb()
})

gulp.task('windows-icon', ['iconset'], function() {
  return gulp.src([
    'build/icon.iconset/icon_16x16.png',
    'build/icon.iconset/icon_32x32.png',
    'build/icon.iconset/icon_32x32@2x.png',
    'build/icon.iconset/icon_128x128.png',
    'build/icon.iconset/icon_256x256.png'
  ]).pipe(toIco('icon.ico'))
    .pipe(gulp.dest('build'))
})

function generateIcon(outputFile, size) {
  return gulp.src('gramin-express-logo.svg')
    .pipe(rename(outputFile))
    .pipe(svg2png({width: size, height: size}))
    .pipe(gulp.dest('build/icon.iconset'))
}
