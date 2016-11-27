const mongoose = require("./mongooseExtended");

const ErrorHandlerSchema = new mongoose.Schema({
	error : String,
	message : String,
	data : Object // the data showing what was handled at the moment of error
}, {versionKey: false});

// Force name of the collection to avoid standard naming
ErrorHandlerSchema.set('collection', 'ErrorHandler');

const ErrorHandlerModel = mongoose.model('ErrorHandler', ErrorHandlerSchema);

module.exports = ErrorHandlerModel;
