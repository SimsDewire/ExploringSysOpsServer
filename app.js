"use strict";

const winston = require("winston");
const logger = new (winston.Logger)({
	transports: [
		new winston.transports.File({
			name: 'debug-log',
			filename: 'logs/debug.log',
			level: 'debug'
		}),
		new winston.transports.File({
			name: 'info-log',
			filename: 'logs/info.log',
			level: 'info'
		}),
		new winston.transports.File({
			name: 'error-log',
			filename: 'logs/error.log',
			level: 'error'
		})
	]
});

if (process.env.NODE_ENV === 'test') {
	logger.add(winston.transports.Console, {prettyPrint: true});
}

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // v1.0.5
const http = require("http");
const upload = multer(); // for parsing multipart/form-data
const app = express();

// Start our own Git server
const gitserver = require("./git-server.js")(app, logger);

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes/routes")(app, upload, http, logger);

const server = app.listen(3000, function () {
	logger.log('info', 'Listening on port %s...' + server.address().port);
});

// Export the app object
module.exports = app;
