var mongoose = require("./mongooseExtended");

var SourceValuesSchema = new mongoose.Schema({
	value : String,
	createdAt : { type: Date, default: Date.now }
}, {strict: "throw"});


module.exports = function(name) {
	SourceValuesSchema.set('collection', name);

	var SourceValuesModel = mongoose.model(name, SourceValuesSchema);
		
	return SourceValuesModel;
};
