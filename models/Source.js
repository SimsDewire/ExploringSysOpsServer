const mongoose = require("./mongooseExtended");

const SourceSchema = new mongoose.Schema({
	URL : {type: String, unique: true, dropDups: true},
	updatedAt : { type: Date, default: Date.now },
	pluginID : mongoose.Schema.Types.ObjectId
}, {strict: "throw", versionKey: false});

// Force name of the collection to avoid standard naming
SourceSchema.set('collection', 'Source');

const SourceModel = mongoose.model('Source', SourceSchema);

module.exports = SourceModel;
