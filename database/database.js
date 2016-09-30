var mongoose = require("mongoose");

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

mongoose.Promise = global.Promise; // Remove promise warning
mongoose.connect(url);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
	console.log("Connection succeeded.");
});


/*
###### Load module objects from model files for testing purposes
*/
var PluginModel = require('../models/Plugin.js');
var SourceModel = require('../models/Source.js');
var SourceValuesModel = require('../models/SourceValues.js')('Telia01');

var pluginTest = new PluginModel();
var sourceTest = new SourceModel();
var sourceValuesTest = new SourceValuesModel();


/*
###### Add testdata into each of the module objects
*/

pluginTest.setValues({name : "1234", 
							description : "5678", 
							creator : "9012", 
							version : "4444",
							pluginPath : "5555",
							webURL : "6666"});
							
sourceTest.setValues({
	URL : "www.google.se",
	updatedAt : new Date().toJSON().slice(0,10),
	pluginID : pluginTest._id
});

sourceValuesTest.setValues({
	value : "Source valuezs",
	createdAt : new Date().toJSON().slice(0,10)
});


/*
###### Save testdata into respective table of each model object
*/
pluginTest.save();
sourceTest.save();
sourceValuesTest.save();


module.exports = {
	// TODO: Make some sort of API for the database here
	A: function() {
		console.log("A is called from database!");
	},
	
	B: function() {
		console.log("B is called from database!");
	}
};
