const mongoose = require("./mongooseExtended");

const SourceValuesSchema = new mongoose.Schema({
	value : String,
	createdAt : { type: Date, default: Date.now }
}, {strict: "throw", versionKey: false});


module.exports = function(name) {
	SourceValuesSchema.set('collection', name);

	const SourceValuesModel = mongoose.model(name, SourceValuesSchema);
		
	return SourceValuesModel;
};
