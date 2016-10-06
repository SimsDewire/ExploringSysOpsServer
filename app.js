var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer"); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var app = express();

/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var externcalls = require("./externcalls/extern.js");*/
var routes = require("./routes/routes.js")(app, upload);
//app.use(externcalls);
 
 
// Load database module
//var databaseHandler = require('./database/database.js');


/*
var result = databaseHandler.AddSource({
	naasdsadsadme : "This should go wrong!"
});*/


// Find plugin by name
/*databaseHandler.FindPlugin({name: "FunnyPlugin"}).then(function(result) {
	//console.log(result[0]._id);
	
	var r = databaseHandler.AddSource({
		URL : "www.x.x.com",
		pluginID : result[0]._id
	});
	
	console.log(r);
});*/

/*
// Add some data into a collection called httpwwwgooglese
console.log(databaseHandler.AddSourceValue({value : "Value A", createdAt : new Date("Tue Oct 04 2016 17:30:33 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
console.log(databaseHandler.AddSourceValue({value : "Value B", createdAt : new Date("Tue Oct 04 2016 17:30:39 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
console.log(databaseHandler.AddSourceValue({value : "Value C", createdAt : new Date("Tue Oct 04 2016 17:30:51 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
console.log(databaseHandler.AddSourceValue({value : "Value D", createdAt : new Date("Tue Oct 04 2016 17:31:17 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));
console.log(databaseHandler.AddSourceValue({value : "Value E", createdAt : new Date("Tue Oct 04 2016 17:25:01 GMT+0200 (CEST)")}, "http://www.google.se".replace(/[^A-Za-z0-9]/g, '')));

// Search in a certain interval, in the data history
databaseHandler.FindSourceValue(new Date("Tue Oct 04 2016 17:24:00 GMT+0200 (CEST)"), 
								new Date("Tue Oct 04 2016 17:37:00 GMT+0200 (CEST)"), 
								"httpwwwgooglese").then(function(result) {
	
	console.log(result);
});*/

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});

//externcalls.calls("http://localhost:3001/courses");

