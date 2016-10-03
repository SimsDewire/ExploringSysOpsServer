var express = require("express");
var bodyParser = require("body-parser");
//var multer = require("multer"); // v1.0.5
//var upload = multer(); // for parsing multipart/form-data
var app = express();

/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var externcalls = require("./externcalls/extern.js");*/
//var routes = require("./routes/routes.js")(app, upload);
//app.use(externcalls);
 
 
// Load database module
var databaseHandler = require('./database/database.js');


// Add a new plugin
databaseHandler.AddPlugin({
	name : "FunnyPlugin",
	description : "A very funny plugin!",
	creator : "Mr.Funny",
	version : "13.37",
	pluginPath : "www.trololz.com/plugin",
	webURL : "www.trololz.com/docs"
});

// Find plugin by name
databaseHandler.FindPlugin({name : "FunnyPlugin"}).then(function(result) {
	console.log(result);
});


/*
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});

externcalls.calls("http://localhost:3001/courses");
*/
