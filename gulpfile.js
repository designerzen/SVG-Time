/*

	gulpfile.js
	===========

	This is the BUILD system for minifying and creating tests

	Tasks ========================================================

	gulp - compress src/js files into dist folder

*/
var gulp = require('gulp');

var options =  {
	// Pass false to skip mangling names.
	mangle : false,
	// Pass an object if you wish to specify additional output options.
	// The defaults are optimized for best compression.
	// see : http://lisperator.net/uglifyjs/codegen
	output : {
		"indent_start"  : 0,     	// start indentation on every line (only when `beautify`)
		"indent_level"  : 4,     	// indentation level (only when `beautify`)
		"quote_keys"    : false, 	// quote all keys in object literals?
		"space_colon"   : true,  	// add a space after colon signs?
		"ascii_only"    : false, 	// output ASCII-safe? (encodes Unicode characters as ASCII)
		"inline_script" : false, 	// escape "</script"?
		"width"         : 80,    	// informative maximum line width (for beautified output)
		"max_line_len"  : 32000, 	// maximum line length (for non-beautified output)
		/*"ie_proof"      : true,  	// output IE-safe code?*/
		"beautify"      : true, 	// beautify output?
		"source_map"    : null,  	// output a source map
		"bracketize"    : false, 	// use brackets every time?
		"comments"      : false, 	// output comments?
		"semicolons"    : true  	// use semicolons to separate statements? (otherwise, newlines)
	},
	// Pass an object to specify custom compressor options.
	// Pass false to skip compression completely.
	// compress
	// A convenience option for options.output.comments.
	// Defaults to preserving no comments.
	"preserveComments" : "license"
};
var optionsMinified =  {
	// Pass false to skip mangling names.
	mangle : true,
	// Pass an object if you wish to specify additional output options.
	// The defaults are optimized for best compression.
	// see : http://lisperator.net/uglifyjs/codegen
	output : {
		"indent_start"  : 0,     	// start indentation on every line (only when `beautify`)
		"indent_level"  : 4,     	// indentation level (only when `beautify`)
		"quote_keys"    : false, 	// quote all keys in object literals?
		"space_colon"   : true,  	// add a space after colon signs?
		"ascii_only"    : false, 	// output ASCII-safe? (encodes Unicode characters as ASCII)
		"inline_script" : false, 	// escape "</script"?
		"width"         : 80,    	// informative maximum line width (for beautified output)
		"max_line_len"  : 32000, 	// maximum line length (for non-beautified output)
		/*"ie_proof"      : true,  	// output IE-safe code?*/
		"beautify"      : false, 	// beautify output?
		"source_map"    : null,  	// output a source map
		"bracketize"    : false, 	// use brackets every time?
		"comments"      : false, 	// output comments?
		"semicolons"    : true  	// use semicolons to separate statements? (otherwise, newlines)
	}
};



// Minify and copy all JavaScript
gulp.task('minify', function() {
    var
		rename = require('gulp-rename'),
		uglify = require('gulp-uglify');			// lint!

	return  gulp.src( './src/**/*.js' )
            .pipe( uglify( optionsMinified ) )
            .pipe( rename( function (path) {
			    path.extname = ".min" + path.extname
			}))
            .pipe( gulp.dest( './dist' ) );
});

// Minify and copy all JavaScript
gulp.task('simplify', function() {
    var
		uglify = require('gulp-uglify'),             // squash files
	    jshint = require('gulp-jshint');			// lint!

	return  gulp.src( './src/**/*.js' )
            .pipe( jshint('.jshintrc'))
			.pipe( jshint.reporter('default') )
			.pipe( uglify( options ) )
            .pipe( gulp.dest( './dist' ) );
});

gulp.task('default', ['simplify', 'minify']);
