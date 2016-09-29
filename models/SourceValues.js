var mongoose = require("./mongooseExtended");

var SourceValuesSchema = new mongoose.Schema({
	value : String,
	createdAt : { type: Date, default: Date.now }
});


module.exports = function(name) {
	SourceValuesSchema.set('collection', name);

	var SourceValuesModel = mongoose.model(name, SourceValuesSchema);
		
	return SourceValuesModel;
};
