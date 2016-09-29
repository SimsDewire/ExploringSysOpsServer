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

console.log("Created model files!");


/*
###### Add testdata into each of the module objects
*/
pluginTest.name = "Plugin name";
pluginTest.description = "Plugin Description";
pluginTest.creator = "Creator name";
pluginTest.version = "1.00";
pluginTest.pluginPath = "hello/thar/world";
pluginTest.webURL = "docs.html";

sourceTest.URL = "source.url.com";
sourceTest.updatedAt = new Date().toJSON().slice(0,10);
sourceTest.pluginID = "514324";

sourceValuesTest.value = "Test value";
sourceValuesTest.createdAt = new Date().toJSON().slice(0,10);

console.log("Created testdata!");


/*
###### Save testdata into respective table of each model object
*/
pluginTest.save();
sourceTest.save();
sourceValuesTest.save();

console.log("Saved the following objects...");
console.log(pluginTest);
console.log("\n");
console.log(sourceTest);
console.log("\n");
console.log(sourceValuesTest);
