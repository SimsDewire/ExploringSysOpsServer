var mongoose = require("mongoose");

var SourceSchema = new mongoose.Schema({
	URL : String,
	updatedAt : { type: Date, default: Date.now },
	pluginID : mongoose.Schema.Types.ObjectId
});

// Force name of the collection to avoid standard naming
SourceSchema.set('collection', 'Source');

var SourceModel = mongoose.model('Source', SourceSchema);

module.exports = SourceModel;
