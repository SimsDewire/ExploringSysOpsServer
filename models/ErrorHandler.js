var mongoose = require("./mongooseExtended");

var ErrorHandlerSchema = new mongoose.Schema({
	error : String,
	message : String,
	data : Object // the data stored when it went wrong
});

// Force name of the collection to avoid standard naming
ErrorHandlerSchema.set('collection', 'ErrorHandler');

var PluginModel = mongoose.model('ErrorHandler', PluginSchema);

module.exports = ErrorHandlerModel;
