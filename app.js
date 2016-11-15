var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer"); // v1.0.5
var http = require("http");
var winston = require('winston');
var upload = multer(); // for parsing multipart/form-data
var app = express();


// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

var logger = new (winston.Logger)({
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


var routes = require("./routes/routes")(app, upload, http, logger);


/*var externcalls = require("./externcalls/extern.js");*/
//app.use(externcalls);
 
 
// Load database module
//var databaseHandler = require('./database/database.js');


/*
var result = databaseHandler.AddSource({
	naasdsadsadme : "This should go wrong!"
});*/


// Find plugin by name
/*databaseHandler.FindPlugin({name: "FunnyPlugin"}).then(function(result) {
	//logger.log(result[0]._id);
	
	var r = databaseHandler.AddSource({
		URL : "www.x.x.com",
		pluginID : result[0]._id
	});
	
	logger.log(r);
});*/

/*
// Add some data into a collection called httpwwwgooglese
logger.log(databaseHandler.AddSourceValue({value : "Value A", createdAt : new Date("Tue Oct 04 2016 17:30:33 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
logger.log(databaseHandler.AddSourceValue({value : "Value B", createdAt : new Date("Tue Oct 04 2016 17:30:39 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
logger.log(databaseHandler.AddSourceValue({value : "Value C", createdAt : new Date("Tue Oct 04 2016 17:30:51 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
logger.log(databaseHandler.AddSourceValue({value : "Value D", createdAt : new Date("Tue Oct 04 2016 17:31:17 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
logger.log(databaseHandler.AddSourceValue({value : "Value E", createdAt : new Date("Tue Oct 04 2016 17:25:01 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));

// Search in a certain interval, in the data history
databaseHandler.FindSourceValue(new Date("Tue Oct 04 2016 17:24:00 GMT+0200 (CEST)"), 
								new Date("Tue Oct 04 2016 17:37:00 GMT+0200 (CEST)"), 
								"httpwwwgooglese").then(function(result) {
	
	logger.log(result);
});*/

var server = app.listen(3000, function () {
	logger.log('info', 'Listening on port %s...' + server.address().port);
});


//externcalls.calls("http://localhost:3001/courses");

// Export the app object
module.exports = app;