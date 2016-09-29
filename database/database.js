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

// Load module DataHistory.js
var DataHistoryModel = require('../models/DataHistory.js');

// Create instance of DataHistory model to make testdata
var testData = new DataHistoryModel();
testData.type = "graph";
testData.sender = "FK";
testData.data = "saoid wqoie ihwqeowq hewqoie hwqewq";
testData.time = new Date().toJSON().slice(0,10);

// Save created testdata to database
testData.save(
	function(err) {
		if (err) {
			console.log("Could not store history testdata!");
		} else {
			console.log("Saved history testdata successfully: ");
			console.log(testData);
		}
	}
);

// Load module Plugin.js
var PluginModel = require('../models/Plugin.js');

// Create instance of Plugin model
var testDataPlugin = new PluginModel();
testDataPlugin.pluginID = 500;
testDataPlugin.source = "Something useful";

testDataPlugin.save(
	function(err) {
		if (err) {
			console.log("Could not store plugin testdata!");
		} else {
			console.log("Saved plugin testdata successfully: ");
			console.log(testDataPlugin);
		}
	}
);
