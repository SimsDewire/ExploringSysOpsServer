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
###### Load module objects from model files
*/
var PluginModel = require('../models/Plugin.js');
var SourceModel = require('../models/Source.js');
var SourceValuesModel = require('../models/SourceValues.js')('Telia01');
var ErrorHandlerModel = require('../models/ErrorHandler.js');


/*
Database API functions 
*/
module.exports = {
	AddPlugin : function(pluginJSON) {
		var createdPlugin = new PluginModel(pluginJSON);
		
		createdPlugin.save(function(err) {
			if (err) {
				new ErrorHandlerModel({error: 1, message: "Could not add plugin!", data: pluginJSON}).save();
			}
		});
	},
	
	FindPlugin : function(searchJSON) {
		return PluginModel.find(searchJSON, function (err, result) {
			if (err) {
				new ErrorHandlerModel({error: 1, message: "Could not find plugin!", data: searchJSON}).save();
			}
			return result;
		});
	}
};
