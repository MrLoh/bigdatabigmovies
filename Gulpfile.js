const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const jade = require('gulp-jade')
const data = require('gulp-data')
const stream = require('merge-stream')
const path = require('path')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel');

function requireUncached($module) {
    delete require.cache[require.resolve($module)]
    return require($module)
}


// JADE

var jadeInput = ['program/*.json', 'program/*.jade']
var jadeTemplate = 'program/template.jade'
var jadeOutput = 'program'
var jsonBase = './program/'
var jsonData = ['science_day', 'industry_day']
var jadeOptions = {
	pretty: "\t"
}

function compileJade(jsonDataFileName) {
	return gulp
		.src(jadeTemplate)
		.pipe(data( (file) => {
			return requireUncached(`${jsonBase+jsonDataFileName}.json`)
		}))
		.pipe(jade(jadeOptions))
		.pipe(rename(`${jsonDataFileName}.html`))
		.pipe(gulp.dest(jadeOutput))
}

gulp.task('jade', () => {
	for( var d of jsonData ){
		compileJade(d)
	}
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


// JS

var jsInput = ["js/*.js", "!js/*min.js"]
var jsOutput = "js/"

gulp.task('js', () => {
	return gulp
		.src(jsInput)
		.pipe(babel({presets: ['es2015']}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(jsOutput))
});


// WATCH

function logEvent(event) {
	console.log(`File ${path.relative(__dirname, event.path)} was ${event.type}, running tasks...`)
}

gulp.task('watch', () => {
	gulp.watch(sassInput, ['sass']).on('change', logEvent)
	gulp.watch(jadeInput, ['jade']).on('change', logEvent)
	gulp.watch(jsInput, ['js']).on('change', logEvent)
})


// DEFAULT

gulp.task('default', ['sass', 'js', 'jade', 'watch'])
