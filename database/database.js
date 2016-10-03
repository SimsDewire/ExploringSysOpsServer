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


function generateErrorObject(errorMessage, errorJSON) {
	var errorObj = new ErrorHandlerModel({error: 1, message: errorMessage, data: errorJSON});
	errorObj.save();
	return errorObj;
}

/*
Database API functions 
*/
module.exports = {
	AddPlugin : function(pluginJSON) {
		try {
			var createdPlugin = new PluginModel(pluginJSON);
		
			createdPlugin.save().then(function (res) {
				console.log("Added plugin", res);
			}).catch(function(err) {
				return generateErrorObject("Could not add plugin!");
			});
		} catch(e) {
			return generateErrorObject("Wrong JSON object was sent!");
		}
	},
	
	FindPlugin : function(searchJSON) {
		return PluginModel.find(searchJSON).then(function (result) {
			return result;
		}).catch(function(err) {
			return generateErrorObject("Could not find plugin!");
		});
	}
};
