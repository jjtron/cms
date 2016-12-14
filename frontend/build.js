var path = require("path");
var Builder = require('systemjs-builder');
var builder = new Builder('', 'systemjs.config.js');

builder.buildStatic('app/main.js', 'cms-sfx.js')
	.then(function() {
	  console.log('Build complete');
	})
	.catch(function(err) {
	  console.log('Build error');
	  console.log(err);
	});