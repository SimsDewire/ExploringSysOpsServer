var mongoose = require("./mongooseExtended");

var ErrorHandlerSchema = new mongoose.Schema({
	error : String,
	message : String,
	data : Object // the data used when it went wrong
});

// Force name of the collection to avoid standard naming
ErrorHandlerSchema.set('collection', 'ErrorHandler');

var ErrorHandlerModel = mongoose.model('ErrorHandler', ErrorHandlerSchema);

module.exports = ErrorHandlerModel;
