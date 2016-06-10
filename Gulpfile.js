const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const jade = require('gulp-jade')
const data = require('gulp-data')
const stream = require('merge-stream')
const path = require('path')


// JADE

var jadeInput = ['program/*.json', 'program/*.jade']
var jadeTemplate = 'program/template.jade'
var jadeOutput = 'program'
var jsonBase = './program/'
var jsonData = ['program_sd', 'program_id']
var jadeOptions = {
  pretty: "\t"
}

gulp.task('jade', () => {
  var tasks = []
  for( var d of jsonData ){
    tasks.push(
      gulp
        .src(jadeTemplate)
        .pipe(data( (file) => {
          return require(`${jsonBase+d}.json`)
        }))
        .pipe(jade(jadeOptions))
        .pipe(rename(`${d}.html`))
        .pipe(gulp.dest(jadeOutput))
    )
  }
  return stream(tasks)
});


// SASS

var sassInput = 'css/*.scss'
var sassOutput = 'css/'

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}

gulp.task('sass', () => {
  return gulp
    .src(sassInput)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(sassOutput))
})


// WATCH

function logEvent(event) {
  console.log(`File ${path.relative(__dirname, event.path)} was ${event.type}, running tasks...`)
}

gulp.task('watch', () => {
  gulp
    .watch(sassInput, ['sass'])
    .on('change', logEvent)
  gulp
    .watch(jadeInput, ['jade'])
    .on('change', logEvent)
})


// DEFAULT

gulp.task('default', ['sass', 'jade', 'watch'])
