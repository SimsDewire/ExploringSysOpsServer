var mongoose = require("./mongooseExtended");

var jsonRepresentation = {
	URL : String,
	updatedAt : { type: Date, default: Date.now },
	pluginID : mongoose.Schema.Types.ObjectId
};

var SourceSchema = new mongoose.Schema(jsonRepresentation);

// Force name of the collection to avoid standard naming
SourceSchema.set('collection', 'Source');

var SourceModel = mongoose.model('Source', SourceSchema);

module.exports = SourceModel;
