var mongoose = require("mongoose");

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

mongoose.Promise = global.Promise; // Remove promise warning
mongoose.connect(url);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
	//console.log("Connection succeeded.");
});


/*
###### Load module objects from model files
*/
var PluginModel = require('../models/Plugin.js');
var SourceModel = require('../models/Source.js');
var ErrorHandlerModel = require('../models/ErrorHandler.js');


/* generateErrorObject(errorMessage, errorJSON)
Generates a error message BSON object and saves the data to the ErrorHandler table.
PARAMS: errorMessage, the message describing the error
		errorJSON, the JSON message that was last handled when the error occured
		* 
RETURNS: BSON object based on model ErrorHandlerModel
*/
function generateErrorObject(errorMessage, errorJSON) {
	var errorObj = new ErrorHandlerModel({error: 1, message: errorMessage, data: errorJSON});
	
	errorObj.save().catch(function(err) {
		console.log("Could not save errorMessage to database:", err);
	});
	
	return errorObj;
}

/*
Database API functions 
*/
module.exports = {
	/* AddPlugin(pluginJSON)
	* PARAMETERS: pluginJSON, the data to store (see Plugin.js schema)
	* RETURNS: BSON object created of model PluginModel
	*/
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
		
		return createdPlugin;
	},
	
	/* FindPlugin(searchJSON)
	* PARAMETERS: searchJSON, the data to search for (See Plugin.js schema)
	* RETURNS: BSON object created of model PluginModel
	*/
	FindPlugin : function(searchJSON) {
		return PluginModel.find(searchJSON).then(function (result) {
			return result;
		}).catch(function(err) {
			return generateErrorObject("Could not find plugin!");
		});
	},
	
	/* AddSource(sourceJSON)
	* PARAMETERS: sourceJSON, the data to store (see Source.js schema)
	* RETURNS: BSON object created of model SourceModel
	*/
	AddSource : function(sourceJSON) {
		try {
			var createdSource = new SourceModel(sourceJSON);
			createdSource.save().then(function (res) {
				//console.log("Added source", res);
			}).catch(function(err) {
				return generateErrorObject("Could not add source!");
			});
		} catch(e) {
			return generateErrorObject("Wrong JSON object was sent!");
		}
		
		return createdSource;
	},
	
	/* FindSource(searchJSON)
	* PARAMETERS: searchJSON, the data source to search for (See Source.js schema)
	* RETURNS: BSON object created of model DatasourceModel
	*/
	FindSource : function(searchJSON) {
		return SourceModel.find(searchJSON).then(function (result) {
			return result;
		}).catch(function(err) {
			return generateErrorObject("Could not find source!");
		});
	},
	
	/* AddSourceValue(sourceValueJSON, collectionName)
	* PARAMETERS: sourceValueJSON, the data to store (see SourceValues.js schema)
	*			  collectionName, name of the collection to store inside
	* RETURNS: BSON object created of model SourceValueModel
	*/
	AddSourceValue : function(sourceValueJSON, collectionName) {
		var SourceValueModel = require('../models/SourceValues.js')(collectionName);
		

			// console.log("Trying to add source value: " + sourceValueJSON + " into collection: " + collectionName);
		try {
			var createdSourceValue = new SourceValueModel(sourceValueJSON);
		
			createdSourceValue.save().then(function (res) {

				// console.log("Successfully added source value " + res + " into collection " + collectionName);
			}).catch(function(err) {
				return generateErrorObject("Could not add source value!");
			});
		} catch(e) {
			return generateErrorObject("Wrong JSON object was sent!");
		}
		
		return createdSourceValue;
	},
	
	/* FindSourceValue(startDate, endDate, collectionName)
	* PARAMETERS: startDate, the start date of interval
	* 			  endDate, the end date of interval
	* 			  collectionName, name of the datasource values collection to search
	* 
	* 		      Format of the date should be like this: 
	* 			  new Date("Tue Oct 04 2016 17:24:00 GMT+0200 (CEST)");
	* RETURNS: BSON containing all the search results
	*/
	FindSourceValue : function(startDate, endDate, collectionName) {
		var SourceValueModel = require('../models/SourceValues.js')(collectionName);
		
		return SourceValueModel.find({createdAt : {'$gte' : startDate, '$lte' : endDate}}).then(function (result) {
			return result;
		}).catch(function(err) {
			return generateErrorObject("Could not find data specified!");
		});
	},

	/* GetSourceValueLatest(collectionName, numLimit)
	* PARAMETERS: collectionName, the url of the source or name of table.
	*			  numLimit, the number of objects that should be returned.
	*
	* RETURNS: BSON containing the data objects.
	*/
	GetSourceValueLatest : function(collectionName, numLimit) {
		var SourceValueModel = require('../models/SourceValues.js')(collectionName);

		return SourceValueModel.find({}).sort('-createdAt').limit(parseInt(numLimit)).then(function (result) {
			return result;
		}).catch(function(err) {
			return generateErrorObject("Could not find data specified!");
		});	
	}
};
