// ref: http://stackoverflow.com/questions/14531232/using-winston-in-several-modules

var winston = require('winston');
winston.add(winston.transports.File, { filename: "error.log" });